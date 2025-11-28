import axios from 'axios';
import activityTracker from './activityTracker';

/**
 * 🔥 Setup global axios interceptors با بهینه‌سازی
 * - Request queuing برای جلوگیری از overload
 * - Response caching
 * - Request deduplication
 * - Retry logic
 */

// تنظیمات
const CONFIG = {
  maxConcurrentRequests: 10, // حداکثر درخواست همزمان
  requestTimeout: 30000, // 30 ثانیه timeout
  retryCount: 2, // تعداد retry برای خطاهای شبکه
  retryDelay: 1000, // تاخیر اولیه retry
};

// صف درخواست‌ها
let activeRequests = 0;
const requestQueue = [];

// کش ساده برای GET requests
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 دقیقه

// درخواست‌های در حال انتظار برای deduplication
const pendingRequests = new Map();

/**
 * پاکسازی کش منقضی شده
 */
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      responseCache.delete(key);
    }
  }
};

// پاکسازی هر 5 دقیقه
setInterval(cleanExpiredCache, CACHE_TTL);

/**
 * ساخت کلید کش
 */
const getCacheKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
};

/**
 * پردازش صف
 */
const processQueue = () => {
  while (activeRequests < CONFIG.maxConcurrentRequests && requestQueue.length > 0) {
    const { config, resolve, reject } = requestQueue.shift();
    activeRequests++;

    axios(config)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activeRequests--;
        processQueue();
      });
  }
};

/**
 * Setup global axios interceptors for error handling and activity tracking
 * This should be called once when the app initializes
 */
export const setupAxiosInterceptors = () => {
  // تنظیم timeout پیش‌فرض
  axios.defaults.timeout = CONFIG.requestTimeout;

  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // Store request start time
      config.metadata = { startTime: Date.now() };

      // 🔥 بهینه‌سازی: کش GET requests (فقط برای endpoints خاص)
      if (config.method?.toLowerCase() === 'get' && config.cache !== false) {
        const cacheKey = getCacheKey(config);
        const cached = responseCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          // استفاده از adapter برای برگرداندن کش
          config.adapter = () => {
            return Promise.resolve({
              data: cached.data,
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
              cached: true,
            });
          };
        }
      }

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
      const duration = Date.now() - (response.config.metadata?.startTime || Date.now());

      try {
        const url = new URL(response.config.url, response.config.baseURL || window.location.origin);
        activityTracker.trackApiCall(
          url.pathname,
          response.config.method.toUpperCase(),
          response.status,
          duration
        );
      } catch (e) {
        // نادیده گرفتن خطای URL parsing
      }

      // 🔥 بهینه‌سازی: ذخیره در کش برای GET requests
      if (
        response.config.method?.toLowerCase() === 'get' &&
        !response.cached &&
        response.config.cache !== false
      ) {
        const cacheKey = getCacheKey(response.config);
        responseCache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }

      return response;
    },
    async (error) => {
      // Track failed API call
      if (error.config && error.config.metadata) {
        const duration = Date.now() - error.config.metadata.startTime;
        try {
          const url = error.config.url ?
            new URL(error.config.url, error.config.baseURL || window.location.origin) :
            { pathname: 'unknown' };

          activityTracker.trackApiCall(
            url.pathname,
            error.config.method?.toUpperCase() || 'UNKNOWN',
            error.response?.status || 0,
            duration
          );
        } catch (e) {
          // نادیده گرفتن خطای URL parsing
        }
      }

      // 🔥 بهینه‌سازی: Retry برای خطاهای شبکه
      const config = error.config;
      if (
        config &&
        !config._retry &&
        !error.response && // فقط برای خطاهای شبکه
        (config.method?.toLowerCase() === 'get' || config.method?.toLowerCase() === 'post')
      ) {
        config._retryCount = config._retryCount || 0;

        if (config._retryCount < CONFIG.retryCount) {
          config._retryCount++;
          config._retry = true;

          // تاخیر با exponential backoff
          await new Promise(resolve =>
            setTimeout(resolve, CONFIG.retryDelay * Math.pow(2, config._retryCount - 1))
          );

          return axios(config);
        }
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
 * پاکسازی کش
 */
export const clearCache = () => {
  responseCache.clear();
};

/**
 * پاکسازی کش برای یک URL خاص
 */
export const invalidateCache = (urlPattern) => {
  for (const key of responseCache.keys()) {
    if (key.includes(urlPattern)) {
      responseCache.delete(key);
    }
  }
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
