import { createContext, useContext, useState } from 'react'

/**
 * @context BreadcrumbContext
 * @description Context برای مدیریت breadcrumb در کل اپلیکیشن
 */
const BreadcrumbContext = createContext()

/**
 * @provider BreadcrumbProvider
 * @description Provider برای BreadcrumbContext
 */
export function BreadcrumbProvider({ children }) {
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const value = {
    breadcrumbs,
    setBreadcrumbs,
  }

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}

/**
 * @hook useBreadcrumb
 * @description Hook برای دسترسی به breadcrumb context
 */
export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
  }
  return context
}

export default BreadcrumbContext
