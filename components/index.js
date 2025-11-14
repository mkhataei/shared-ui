/**
 * Re-export کامپوننت‌های خطا برای سهولت دسترسی
 */
export { default as ErrorPage } from './ErrorPage'
export { ErrorHandler, withErrorHandling, useErrorPage } from './withErrorHandling'

/**
 * کامپوننت‌های میانبر برای خطاهای رایج
 */
import ErrorPage from './ErrorPage'

export const AccessDenied403 = (props) => (
  <ErrorPage statusCode={403} {...props} />
)

export const NotFound404 = (props) => (
  <ErrorPage statusCode={404} {...props} />
)

export const ServerError500 = (props) => (
  <ErrorPage statusCode={500} {...props} />
)

export const Unauthorized401 = (props) => (
  <ErrorPage statusCode={401} {...props} />
)

/**
 * برای سازگاری با کد قبلی
 */
export const AccessDeniedMessage = AccessDenied403
export const NotFoundMessage = NotFound404
