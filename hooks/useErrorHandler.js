import { useState, useCallback } from 'react';
import { isForbiddenError, isNotFoundError } from '@shared/utils/axiosSetup';

/**
 * Custom hook to handle error state with specific flags for common HTTP errors
 * @returns {Object} Error state and handlers
 */
export const useErrorHandler = () => {
  const [error, setErrorState] = useState(null);

  const setError = useCallback((err) => {
    setErrorState(err);
  }, []);

  const resetError = useCallback(() => {
    setErrorState(null);
  }, []);

  const is403 = error ? isForbiddenError(error) : false;
  const is404 = error ? isNotFoundError(error) : false;

  return {
    error,
    setError,
    resetError,
    is403,
    is404,
  };
};

/**
 * Hook to throw errors to ErrorBoundary
 * Use this when you want to bubble errors up to the nearest ErrorBoundary
 */
export const useAsyncError = () => {
  const [, setError] = useState();
  
  return useCallback((error) => {
    setError(() => {
      throw error;
    });
  }, []);
};
