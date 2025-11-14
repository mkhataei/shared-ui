import axios from 'axios';

/**
 * Setup global axios interceptors for error handling
 * This should be called once when the app initializes
 */
export const setupAxiosInterceptors = () => {
  // Response interceptor to handle 403 errors globally
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
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
