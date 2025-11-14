import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

/**
 * Hook سراسری برای مدیریت خطاهای HTTP
 * این hook یک interceptor به axios اضافه می‌کند که خطاهای خاص را مدیریت می‌کند
 */
export const useGlobalHttpErrorHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // اضافه کردن response interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // 401 - عدم احراز هویت → هدایت به صفحه لاگین
        if (error.response?.status === 401) {
          // پاک کردن token و هدایت به login
          localStorage.removeItem('token')
          navigate('/sign-in', { 
            state: { 
              from: window.location.pathname,
              message: 'جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.'
            } 
          })
        }

        // 403 - عدم دسترسی → نمایش صفحه خطا در همان مکان
        // این خطا توسط ErrorHandler در component مدیریت می‌شود

        // 404 - یافت نشد → نمایش صفحه خطا در همان مکان
        // این خطا توسط ErrorHandler در component مدیریت می‌شود

        // 500 - خطای سرور → نمایش پیام خطا
        if (error.response?.status >= 500) {
          console.error('Server Error:', error.response?.data)
          // می‌توانید یک toast یا notification نمایش دهید
        }

        // پرتاب خطا برای استفاده در component
        return Promise.reject(error)
      }
    )

    // پاک کردن interceptor هنگام unmount
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [navigate])
}

/**
 * Provider برای Global HTTP Error Handling
 * این component باید در سطح بالای App قرار گیرد
 */
export const GlobalHttpErrorProvider = ({ children }) => {
  useGlobalHttpErrorHandler()
  return <>{children}</>
}
