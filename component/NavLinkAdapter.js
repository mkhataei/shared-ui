/**
 * @module NavLinkAdapter
 * @description آداپتور NavLink برای سازگاری با React Router v6
 */

import { forwardRef } from 'react'
import { NavLink as BaseNavLink } from 'react-router-dom'

/**
 * @component NavLinkAdapter
 * @description کامپوننت آداپتور برای NavLink که با Material-UI و React Router v6 سازگار است
 * @param {Object} props - props کامپوننت
 * @param {string} props.activeClassName - کلاس CSS برای حالت فعال
 * @param {Object} props.activeStyle - استایل برای حالت فعال
 * @param {React.Ref} ref - ref به المان DOM
 */
const NavLinkAdapter = forwardRef(({ activeClassName, activeStyle, ...props }, ref) => {
  return (
    <BaseNavLink
      ref={ref}
      {...props}
      className={({ isActive }) =>
        [props.className, isActive ? activeClassName : null].filter(Boolean).join(' ')
      }
      style={({ isActive }) => ({
        ...props.style,
        ...(isActive ? activeStyle : null),
      })}
    />
  )
})

NavLinkAdapter.displayName = 'NavLinkAdapter'

export default NavLinkAdapter
