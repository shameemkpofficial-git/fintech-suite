import { useCallback, useEffect, useRef, useState } from 'react';
import { useAsync } from './useAsync';
import { useFintechStore } from './useFintechStore';
import { useNetwork } from './useNetwork';

interface SafeRequestOptions<T> {
  cacheKey?: 'balance' | 'transactions';
  onSuccess?: (data: T) => void;
  maxRetries?: number;
}

/**
 * Enhanced async hook with offline fallback, retries, and encrypted caching.
 * Optimized with useRef to prevent unnecessary re-renders when options change.
 */
export const useSafeRequest = <T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: SafeRequestOptions<T> = {}
) => {
  const { isConnected } = useNetwork();
  const { setBalance, setTransactions } = useFintechStore();
  const { execute: baseExecute, loading, error, data: baseData, setData } = useAsync(asyncFunction);

  const [isOfflineData, setIsOfflineData] = useState(false);

  // Use a ref to store options to avoid them being a dependency of the callback
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const execute = useCallback(async (...args: any[]) => {
    const currentOptions = optionsRef.current;

    // 1. Offline Fallback
    if (!isConnected && currentOptions.cacheKey) {
      console.log(`[SafeRequest] Offline. Resolving ${currentOptions.cacheKey} from cache.`);
      const cachedData = currentOptions.cacheKey === 'balance'
        ? useFintechStore.getState().balance
        : useFintechStore.getState().transactions;
      if (cachedData !== null) {
        setIsOfflineData(true);
        setData(cachedData as T);
        return cachedData as T;
      }
    }

    // 2. Online Execution with Retries
    let lastError;
    const maxRetries = currentOptions.maxRetries ?? 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await baseExecute(...args);

        // 3. Update Cache on Success
        if (currentOptions.cacheKey === 'balance') setBalance(result as any);
        if (currentOptions.cacheKey === 'transactions') setTransactions(result as any);

        setIsOfflineData(false);
        if (currentOptions.onSuccess) currentOptions.onSuccess(result);
        return result;
      } catch (err) {
        lastError = err;
        console.warn(`[SafeRequest] Attempt ${attempt + 1} failed:`, err);
        // Delay before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // 4. Final Fallback if all retries failed (even if online)
    if (currentOptions.cacheKey) {
      const cachedData = currentOptions.cacheKey === 'balance'
        ? useFintechStore.getState().balance
        : useFintechStore.getState().transactions;
      if (cachedData !== null) {
        setIsOfflineData(true);
        setData(cachedData as T);
        return cachedData as T;
      }
    }

    throw lastError;
  }, [isConnected, baseExecute, setData, setBalance, setTransactions]);

  return {
    execute,
    loading,
    error,
    data: baseData,
    isOfflineData,
  };
};
