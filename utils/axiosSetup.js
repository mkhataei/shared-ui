import axios from 'axios';
import activityTracker from './activityTracker';

/**
 * Setup global axios interceptors for error handling and activity tracking
 * This should be called once when the app initializes
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor to track API calls
  axios.interceptors.request.use(
    (config) => {
      // Store request start time
      config.metadata = { startTime: Date.now() };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle 403 errors globally and track API calls
  axios.interceptors.response.use(
    (response) => {
      // Track successful API call
      const duration = Date.now() - response.config.metadata.startTime;
      const url = new URL(response.config.url, response.config.baseURL || window.location.origin);
      
      activityTracker.trackApiCall(
        url.pathname,
        response.config.method.toUpperCase(),
        response.status,
        duration
      );
      
      return response;
    },
    (error) => {
      // Track failed API call
      if (error.config && error.config.metadata) {
        const duration = Date.now() - error.config.metadata.startTime;
        const url = error.config.url ? 
          new URL(error.config.url, error.config.baseURL || window.location.origin) : 
          { pathname: 'unknown' };
        
        activityTracker.trackApiCall(
          url.pathname,
          error.config.method?.toUpperCase() || 'UNKNOWN',
          error.response?.status || 0,
          duration
        );
      }

      // Check if it's a 403 Forbidden error
      if (error.response && error.response.status === 403) {
        // Add a flag to the error for easier checking in components
        error.isForbidden = true;
      }
      
      return Promise.reject(error);
    }
  );
};

/**
 * Check if an error is a 403 Forbidden error
 * @param {Error} error - The error object to check
 * @returns {boolean} True if error is 403
 */
export const isForbiddenError = (error) => {
  return error?.response?.status === 403 || error?.isForbidden === true;
};

/**
 * Check if an error is a 404 Not Found error
 * @param {Error} error - The error object to check
 * @returns {boolean} True if error is 404
 */
export const isNotFoundError = (error) => {
  return error?.response?.status === 404;
};
