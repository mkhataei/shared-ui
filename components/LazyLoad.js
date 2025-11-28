/**
 * 🔥 Lazy Loading Components
 * کامپوننت‌های بهینه برای lazy loading و code splitting
 */

import React, { Suspense, lazy, memo, useState, useEffect, useRef } from 'react'
import { Box, CircularProgress, Skeleton, Typography } from '@mui/material'

/**
 * Loading fallback component
 */
export const LoadingFallback = memo(({ height = 200, message = 'در حال بارگذاری...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height,
      gap: 2,
    }}
  >
    <CircularProgress size={32} />
    <Typography variant='caption' color='text.secondary'>
      {message}
    </Typography>
  </Box>
))

LoadingFallback.displayName = 'LoadingFallback'

/**
 * Skeleton fallback برای کارت‌ها
 */
export const CardSkeleton = memo(({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ p: 2 }}>
        <Skeleton variant='rectangular' height={120} sx={{ borderRadius: 2, mb: 1 }} />
        <Skeleton variant='text' width='80%' />
        <Skeleton variant='text' width='60%' />
      </Box>
    ))}
  </>
))

CardSkeleton.displayName = 'CardSkeleton'

/**
 * Table skeleton
 */
export const TableSkeleton = memo(({ rows = 5, columns = 4 }) => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant='rectangular' height={40} sx={{ mb: 1 }} />
    {Array.from({ length: rows }).map((_, index) => (
      <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant='text'
            sx={{ flex: 1 }}
          />
        ))}
      </Box>
    ))}
  </Box>
))

TableSkeleton.displayName = 'TableSkeleton'

/**
 * Higher-Order Component برای lazy loading با Suspense
 * @param {Function} importFn - تابع dynamic import
 * @param {Object} options - تنظیمات
 */
export const withLazyLoad = (importFn, options = {}) => {
  const LazyComponent = lazy(importFn)

  const {
    fallback = <LoadingFallback />,
    preload = false,
    displayName = 'LazyComponent',
  } = options

  // Preload component اگر نیاز بود
  if (preload) {
    importFn()
  }

  const WrappedComponent = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )

  WrappedComponent.displayName = `LazyLoad(${displayName})`
  WrappedComponent.preload = importFn

  return WrappedComponent
}

/**
 * Intersection Observer based lazy loading
 * فقط وقتی المان در viewport است، محتوا رندر می‌شود
 */
export const LazyRender = memo(
  ({
    children,
    placeholder = <Skeleton variant='rectangular' height={200} />,
    rootMargin = '100px',
    threshold = 0.1,
    once = true,
  }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [hasBeenVisible, setHasBeenVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
      const element = ref.current
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setHasBeenVisible(true)
            if (once) {
              observer.disconnect()
            }
          } else if (!once) {
            setIsVisible(false)
          }
        },
        {
          rootMargin,
          threshold,
        }
      )

      observer.observe(element)

      return () => observer.disconnect()
    }, [rootMargin, threshold, once])

    const shouldRender = once ? hasBeenVisible : isVisible

    return <div ref={ref}>{shouldRender ? children : placeholder}</div>
  }
)

LazyRender.displayName = 'LazyRender'

/**
 * Deferred rendering - رندر با تاخیر برای جلوگیری از blocking
 */
export const DeferredRender = memo(({ children, delay = 0 }) => {
  const [shouldRender, setShouldRender] = useState(delay === 0)

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldRender(true), delay)
      return () => clearTimeout(timer)
    }
  }, [delay])

  if (!shouldRender) return null
  return children
})

DeferredRender.displayName = 'DeferredRender'

/**
 * Progressive image loading
 */
export const ProgressiveImage = memo(
  ({ src, placeholder, alt, ...props }) => {
    const [imageSrc, setImageSrc] = useState(placeholder || '')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setImageSrc(src)
        setLoading(false)
      }
      img.onerror = () => {
        setLoading(false)
      }
    }, [src])

    return (
      <Box sx={{ position: 'relative', ...props.sx }}>
        {loading && (
          <Skeleton
            variant='rectangular'
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        )}
        <img
          src={imageSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
          {...props}
        />
      </Box>
    )
  }
)

ProgressiveImage.displayName = 'ProgressiveImage'

/**
 * Virtual scroll wrapper
 * برای لیست‌های بزرگ، فقط آیتم‌های قابل مشاهده رندر می‌شوند
 */
export const VirtualList = memo(
  ({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    overscan = 3,
  }) => {
    const [scrollTop, setScrollTop] = useState(0)
    const containerRef = useRef(null)

    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2)
    const visibleItems = items.slice(startIndex, endIndex)

    const handleScroll = (e) => {
      requestAnimationFrame(() => {
        setScrollTop(e.target.scrollTop)
      })
    }

    return (
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: items.length * itemHeight,
            position: 'relative',
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                position: 'absolute',
                top: (startIndex + index) * itemHeight,
                height: itemHeight,
                width: '100%',
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    )
  }
)

VirtualList.displayName = 'VirtualList'

export default {
  LoadingFallback,
  CardSkeleton,
  TableSkeleton,
  withLazyLoad,
  LazyRender,
  DeferredRender,
  ProgressiveImage,
  VirtualList,
}
