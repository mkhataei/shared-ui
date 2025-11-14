import React from 'react'
import ErrorPage from '@shared/components/ErrorPage'

/**
 * Higher Order Component برای مدیریت خطاهای HTTP
 * @param {React.Component} Component - کامپوننت اصلی
 * @param {Object} options - تنظیمات
 * @returns {React.Component}
 */
export const withErrorHandling = (Component, options = {}) => {
  return (props) => {
    const {
      error,
      isError,
      // می‌توانیم از react-query یا هر state management دیگری استفاده کنیم
    } = props

    // اگر خطایی وجود دارد
    if (isError && error) {
      const statusCode = error?.response?.status || error?.status || 500
      
      return (
        <ErrorPage
          statusCode={statusCode}
          message={error?.response?.data?.message || error?.message}
          {...options}
        />
      )
    }

    // اگر خطایی نیست، کامپوننت اصلی را نمایش بده
    return <Component {...props} />
  }
}

/**
 * Component wrapper برای مدیریت خطاها
 */
export const ErrorHandler = ({ 
  error, 
  children, 
  statusCode,
  fallback,
  ...errorPageProps 
}) => {
  // اگر خطایی وجود دارد
  if (error) {
    const code = statusCode || error?.response?.status || error?.status || 500
    
    // اگر fallback سفارشی داریم
    if (fallback) {
      return typeof fallback === 'function' 
        ? fallback(error) 
        : fallback
    }
    
    // نمایش صفحه خطای استاندارد
    return (
      <ErrorPage
        statusCode={code}
        message={error?.response?.data?.message || error?.message}
        {...errorPageProps}
      />
    )
  }

  // اگر خطایی نیست، children را نمایش بده
  return <>{children}</>
}

/**
 * Hook سفارشی برای مدیریت خطاها
 */
export const useErrorPage = (error) => {
  if (!error) return null

  const statusCode = error?.response?.status || error?.status || 500
  const message = error?.response?.data?.message || error?.message

  return {
    statusCode,
    message,
    is403: statusCode === 403,
    is404: statusCode === 404,
    is500: statusCode === 500,
    is401: statusCode === 401,
    shouldShowError: true,
  }
}
