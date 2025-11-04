import { useEffect } from 'react'
import { useBreadcrumb } from '../context/BreadcrumbContext'

/**
 * @hook useBreadcrumbEffect
 * @description Hook برای تنظیم breadcrumb با وابستگی‌ها
 * @param {Array} breadcrumbItems - آرایه‌ای از آیتم‌های breadcrumb
 * @param {Array} deps - وابستگی‌هایی که باعث بروزرسانی breadcrumb می‌شوند
 */
export function useBreadcrumbEffect(breadcrumbItems, deps = []) {
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs(breadcrumbItems)
  }, deps)
}

export default useBreadcrumbEffect
