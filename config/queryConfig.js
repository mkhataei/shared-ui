/**
 * 🔥 React Query Configuration بهینه‌سازی شده
 * تنظیمات برای بهبود عملکرد و کاهش بار سرور
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * تنظیمات پیش‌فرض برای staleTime و cacheTime
 * این تنظیمات باعث کاهش تعداد درخواست‌ها به سرور می‌شود
 */
export const QUERY_DEFAULTS = {
  // داده‌ها تا 2 دقیقه تازه (fresh) هستند و refetch نمی‌شوند
  staleTime: 2 * 60 * 1000,

  // داده‌ها تا 10 دقیقه در کش می‌مانند
  gcTime: 10 * 60 * 1000,

  // 🔥 retry هوشمند: برای خطاهای 4xx retry نکن
  retry: (failureCount, error) => {
    // اگر خطای 4xx است (400-499)، retry نکن
    if (error?.response?.status >= 400 && error?.response?.status < 500) {
      return false
    }
    // برای خطاهای دیگر (مثل 5xx یا network errors)، حداکثر 2 بار retry
    return failureCount < 2
  },

  // تاخیر بین retry ها (exponential backoff)
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

  // غیرفعال کردن refetch خودکار در background
  refetchOnWindowFocus: false,

  // غیرفعال کردن refetch در هنگام اتصال مجدد شبکه
  refetchOnReconnect: false,

  // غیرفعال کردن refetch در mount
  refetchOnMount: false,
}

/**
 * تنظیمات برای کوئری‌های مختلف
 */
export const QUERY_CONFIG = {
  // داده‌های کم‌تغییر (مثل تقویم، تنظیمات)
  static: {
    staleTime: 30 * 60 * 1000, // 30 دقیقه
    gcTime: 60 * 60 * 1000, // 1 ساعت
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  // داده‌های نیمه‌پایدار (مثل لیست پروژه‌ها)
  semiStatic: {
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    gcTime: 15 * 60 * 1000, // 15 دقیقه
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  // داده‌های پویا (مثل پیشرفت، وضعیت)
  dynamic: {
    staleTime: 30 * 1000, // 30 ثانیه
    gcTime: 5 * 60 * 1000, // 5 دقیقه
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },

  // داده‌های real-time (مثل نوتیفیکیشن)
  realtime: {
    staleTime: 0, // همیشه stale
    gcTime: 60 * 1000, // 1 دقیقه
    refetchInterval: 30 * 1000, // هر 30 ثانیه
    refetchOnWindowFocus: true,
  },
}

/**
 * ایجاد QueryClient با تنظیمات بهینه
 */
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...QUERY_DEFAULTS,
        // استفاده از structuralSharing برای کاهش re-render
        structuralSharing: true,
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  })
}

/**
 * Query Keys - کلیدهای استاندارد برای کوئری‌ها
 * استفاده از این ساختار باعث بهبود invalidation و مدیریت کش می‌شود
 */
export const queryKeys = {
  // Planning
  projects: {
    all: ['projects'],
    list: (params) => ['projects', 'list', params],
    detail: (id) => ['projects', 'detail', id],
    schedules: (projectId) => ['projects', projectId, 'schedules'],
    activeSchedule: (projectId, date) => ['projects', projectId, 'active-schedule', date],
  },

  // Main Projects
  mainProjects: {
    all: ['main-projects'],
    list: (params) => ['main-projects', 'list', params],
    infinite: (params) => ['main-projects', 'infinite', params],
  },

  // Sub Projects
  subProjects: {
    all: ['sub-projects'],
    list: (parentId) => ['sub-projects', 'list', parentId],
    infinite: (parentId) => ['sub-projects', 'infinite', parentId],
    allList: () => ['sub-projects', 'all-list'],
  },

  // Schedules
  schedules: {
    all: ['schedules'],
    list: (projectId) => ['schedules', 'list', projectId],
    detail: (id) => ['schedules', 'detail', id],
    dates: (scheduleId, params) => ['schedules', scheduleId, 'dates', params],
  },

  // Calendars
  calendars: {
    all: ['calendars'],
    list: () => ['calendars', 'list'],
    detail: (id) => ['calendars', 'detail', id],
  },

  // Companies
  companies: {
    all: ['companies'],
    list: (params) => ['companies', 'list', params],
    detail: (id) => ['companies', 'detail', id],
  },
}

/**
 * Invalidation helpers
 */
export const invalidateQueries = {
  allProjects: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.mainProjects.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.subProjects.all })
  },

  project: (queryClient, projectId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.schedules(projectId) })
  },

  allSchedules: (queryClient, projectId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.schedules.list(projectId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.activeSchedule(projectId) })
  },
}

export default {
  QUERY_DEFAULTS,
  QUERY_CONFIG,
  createOptimizedQueryClient,
  queryKeys,
  invalidateQueries,
}
