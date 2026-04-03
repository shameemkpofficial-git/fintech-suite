import { useReducer, useCallback } from 'react';

type AsyncState<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
};

type AsyncAction<T> =
  | { type: 'START' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'FAILURE'; payload: string }
  | { type: 'SET_DATA'; payload: T | null };

const asyncReducer = <T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> => {
  switch (action.type) {
    case 'START':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, data: action.payload, error: null };
    case 'FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

/**
 * Standardized hook for handling asynchronous operations.
 * Manages loading, error, and data states using useReducer for atomic updates.
 */
export const useAsync = <T>(asyncFunction: (...args: any[]) => Promise<T>) => {
  const [state, dispatch] = useReducer(asyncReducer<T>, {
    loading: false,
    error: null,
    data: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    dispatch({ type: 'START' });
    try {
      const response = await asyncFunction(...args);
      dispatch({ type: 'SUCCESS', payload: response });
      return response;
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred';
      dispatch({ type: 'FAILURE', payload: message });
      throw err;
    }
  }, [asyncFunction]);

  const setData = (data: T | null) => dispatch({ type: 'SET_DATA', payload: data });

  return { 
    execute, 
    loading: state.loading, 
    error: state.error, 
    data: state.data, 
    setData 
  };
};
