/**
 * 🔥 Performance Optimization Utilities
 * ابزارهای بهینه‌سازی عملکرد برای جلوگیری از کندی سیستم
 */

import { useCallback, useEffect, useRef, useState, useMemo } from 'react'

/**
 * Debounce hook - تاخیر در اجرا تا زمانی که کاربر دست از عمل بردارد
 * مناسب برای search input، resize events
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounced callback hook
 */
export const useDebouncedCallback = (callback, delay = 300, deps = []) => {
  const timeoutRef = useRef(null)

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delay, ...deps]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

/**
 * Throttle hook - محدود کردن تعداد اجرا در بازه زمانی
 * مناسب برای scroll events، mouse move
 */
export const useThrottle = (value, delay = 100) => {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastExecuted = useRef(Date.now())

  useEffect(() => {
    const now = Date.now()
    if (now - lastExecuted.current >= delay) {
      lastExecuted.current = now
      setThrottledValue(value)
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now()
        setThrottledValue(value)
      }, delay - (now - lastExecuted.current))
      return () => clearTimeout(timer)
    }
  }, [value, delay])

  return throttledValue
}

/**
 * Throttled callback hook
 */
export const useThrottledCallback = (callback, delay = 100) => {
  const lastExecuted = useRef(0)
  const timeoutRef = useRef(null)

  return useCallback(
    (...args) => {
      const now = Date.now()
      if (now - lastExecuted.current >= delay) {
        lastExecuted.current = now
        callback(...args)
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastExecuted.current = Date.now()
          timeoutRef.current = null
          callback(...args)
        }, delay - (now - lastExecuted.current))
      }
    },
    [callback, delay]
  )
}

/**
 * Intersection Observer hook برای lazy loading
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const targetRef = useRef(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting) {
          setHasIntersected(true)
          if (options.triggerOnce) {
            observer.disconnect()
          }
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
        ...options,
      }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.triggerOnce])

  return { targetRef, isIntersecting, hasIntersected }
}

/**
 * Virtual list hook برای رندر بهینه لیست‌های بزرگ
 */
export const useVirtualList = (items, containerHeight, itemHeight, overscan = 3) => {
  const [scrollTop, setScrollTop] = useState(0)

  const { visibleItems, startIndex, endIndex, totalHeight } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2
    const end = Math.min(items.length, start + visibleCount)

    return {
      visibleItems: items.slice(start, end).map((item, index) => ({
        ...item,
        index: start + index,
        style: {
          position: 'absolute',
          top: (start + index) * itemHeight,
          height: itemHeight,
          width: '100%',
        },
      })),
      startIndex: start,
      endIndex: end,
      totalHeight: items.length * itemHeight,
    }
  }, [items, scrollTop, containerHeight, itemHeight, overscan])

  const handleScroll = useThrottledCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, 16)

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    handleScroll,
    containerStyle: {
      overflow: 'auto',
      height: containerHeight,
    },
    innerStyle: {
      position: 'relative',
      height: totalHeight,
    },
  }
}

/**
 * Request Animation Frame hook برای انیمیشن‌های روان
 */
export const useAnimationFrame = (callback, deps = []) => {
  const requestRef = useRef()
  const previousTimeRef = useRef()

  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current
        callback(deltaTime)
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Idle callback hook برای عملیات غیرضروری
 */
export const useIdleCallback = (callback, options = {}) => {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(callback, { timeout: options.timeout || 1000 })
      return () => cancelIdleCallback(id)
    } else {
      // Fallback برای مرورگرهای قدیمی
      const id = setTimeout(callback, 1)
      return () => clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, options.deps || [])
}

/**
 * مدیریت کش ساده در مموری
 */
class MemoryCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }

  set(key, value) {
    // حذف قدیمی‌ترین آیتم اگر کش پر شد
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    // بررسی انقضا
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  has(key) {
    return this.get(key) !== null
  }

  clear() {
    this.cache.clear()
  }

  delete(key) {
    this.cache.delete(key)
  }
}

export const memoryCache = new MemoryCache()

/**
 * Hook برای کش کردن داده‌ها
 */
export const useCachedData = (key, fetcher, options = {}) => {
  const [data, setData] = useState(() => memoryCache.get(key))
  const [loading, setLoading] = useState(!data)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (data && !options.revalidate) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetcher()
        memoryCache.set(key, result)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, options.revalidate])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      const result = await fetcher()
      memoryCache.set(key, result)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [key, fetcher])

  return { data, loading, error, refetch }
}

/**
 * مانیتورینگ عملکرد
 */
export const performanceMonitor = {
  marks: new Map(),

  start(label) {
    this.marks.set(label, performance.now())
  },

  end(label) {
    const start = this.marks.get(label)
    if (start) {
      const duration = performance.now() - start
      this.marks.delete(label)
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
      }
      return duration
    }
    return 0
  },

  measure(label, fn) {
    this.start(label)
    const result = fn()
    if (result instanceof Promise) {
      return result.finally(() => this.end(label))
    }
    this.end(label)
    return result
  },
}

/**
 * Batch state updates
 */
export const useBatchedState = (initialState) => {
  const [state, setState] = useState(initialState)
  const pendingUpdates = useRef([])
  const frameRef = useRef(null)

  const batchedSetState = useCallback((update) => {
    pendingUpdates.current.push(update)

    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(() => {
        setState((prev) => {
          let newState = prev
          pendingUpdates.current.forEach((update) => {
            newState = typeof update === 'function' ? update(newState) : { ...newState, ...update }
          })
          return newState
        })
        pendingUpdates.current = []
        frameRef.current = null
      })
    }
  }, [])

  return [state, batchedSetState]
}

export default {
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
  useIntersectionObserver,
  useVirtualList,
  useAnimationFrame,
  useIdleCallback,
  useCachedData,
  useBatchedState,
  memoryCache,
  performanceMonitor,
}
