import React from 'react'
import ErrorPage from './ErrorPage'

/**
 * Error Boundary برای گرفتن خطاهای React و نمایش صفحه خطا
 * این کامپوننت تمام خطاهای JavaScript که در component tree رخ می‌دهد را می‌گیرد
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    // به‌روزرسانی state تا در render بعدی fallback UI نمایش داده شود
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // می‌توانید خطا را به یک سرویس logging بفرستید
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // ارسال خطا به سرویس مانیتورینگ (مثل Sentry)
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // می‌توانید هر UI سفارشی‌ای برای خطا نمایش دهید
      const { customFallback } = this.props
      
      if (customFallback) {
        return customFallback(this.state.error, this.state.errorInfo)
      }

      // نمایش صفحه خطای 500 برای خطاهای JavaScript
      return (
        <ErrorPage
          statusCode={500}
          title="خطای غیرمنتظره"
          message="متأسفانه خطایی در برنامه رخ داده است. لطفاً صفحه را تازه‌سازی کنید."
          showBackButton={true}
          showHomeButton={true}
          customActions={
            process.env.NODE_ENV === 'development' && this.state.error ? (
              <details style={{ marginTop: 20, textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', marginBottom: 10 }}>
                  جزئیات خطا (فقط در حالت توسعه)
                </summary>
                <pre style={{ 
                  background: '#1a1a1a', 
                  color: '#00ff00', 
                  padding: 15, 
                  borderRadius: 8,
                  overflow: 'auto',
                  maxHeight: 300,
                  fontSize: 12,
                }}>
                  {this.state.error && this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            ) : null
          }
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
