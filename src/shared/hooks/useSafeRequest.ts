import { useCallback, useState } from 'react';
import { useAsync } from './useAsync';
import { useNetwork } from './useNetwork';
import { useFintechStore } from './useFintechStore';

interface SafeRequestOptions<T> {
  cacheKey?: 'balance' | 'transactions';
  onSuccess?: (data: T) => void;
  maxRetries?: number;
}

/**
 * Enhanced async hook with offline fallback, retries, and encrypted caching.
 */
export const useSafeRequest = <T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: SafeRequestOptions<T> = {}
) => {
  const { isConnected } = useNetwork();
  const { balance, transactions, setBalance, setTransactions } = useFintechStore();
  const { execute: baseExecute, loading, error, data: baseData, setData } = useAsync(asyncFunction);

  const [isOfflineData, setIsOfflineData] = useState(false);

  const execute = useCallback(async (...args: any[]) => {
    // 1. Offline Fallback
    if (!isConnected && options.cacheKey) {
      console.log(`[SafeRequest] Offline. Resolving ${options.cacheKey} from cache.`);
      const cachedData = options.cacheKey === 'balance' ? balance : transactions;
      if (cachedData !== null) {
        setIsOfflineData(true);
        setData(cachedData as T);
        return cachedData as T;
      }
    }

    // 2. Online Execution with Retries
    let lastError;
    const maxRetries = options.maxRetries ?? 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await baseExecute(...args);
        
        // 3. Update Cache on Success
        if (options.cacheKey === 'balance') setBalance(result as any);
        if (options.cacheKey === 'transactions') setTransactions(result as any);
        
        setIsOfflineData(false);
        if (options.onSuccess) options.onSuccess(result);
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
    if (options.cacheKey) {
      const cachedData = options.cacheKey === 'balance' ? balance : transactions;
      if (cachedData !== null) {
        setIsOfflineData(true);
        setData(cachedData as T);
        return cachedData as T;
      }
    }

    throw lastError;
  }, [isConnected, options.cacheKey, balance, transactions, baseExecute, setData, setBalance, setTransactions]);

  return {
    execute,
    loading,
    error,
    data: baseData,
    isOfflineData,
  };
};
