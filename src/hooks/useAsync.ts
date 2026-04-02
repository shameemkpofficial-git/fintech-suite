import { useState, useCallback } from 'react';

/**
 * Standardized hook for handling asynchronous operations.
 * Manages loading, error, and data states in a clean, reusable pattern.
 */
export const useAsync = <T>(asyncFunction: (...args: any[]) => Promise<T>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setData(response);
      return response;
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, error, data, setData };
};
