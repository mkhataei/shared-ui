import Breadcrumbs from '@mui/material/Breadcrumbs'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: '8px 16px',
  width: 'fit-content',
  '& .MuiBreadcrumbs-separator': {
    color: theme.palette.text.secondary,
    margin: '0 8px',
  },
}))

const StyledLink = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none !important',
  fontSize: '0.875rem',
  fontWeight: 400,
  cursor: 'pointer',
}))

const CurrentPage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  fontWeight: 500,
}))

function SimpleBreadcrumbs({
  items = [],
  routes = {},
  defaultItems = [{ label: 'Home', href: '/' }],
}) {
  const navigate = useNavigate()
  const location = useLocation()

  // Get breadcrumb items based on props
  const getBreadcrumbItems = () => {
    // If items are explicitly provided, use them
    if (items.length > 0) {
      return items
    }

    // Check if current path matches any route patterns
    const path = location.pathname
    for (const [routePattern, breadcrumbItems] of Object.entries(routes)) {
      if (path.includes(routePattern)) {
        return breadcrumbItems
      }
    }

    // Fallback to default items
    return defaultItems
  }

  const breadcrumbItems = getBreadcrumbItems()

  const handleClick = (href) => {
    if (href && href !== '#') {
      navigate(href)
    }
  }

  return (
    <StyledBreadcrumbs separator='›' aria-label='breadcrumb'>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1

        if (isLast || item.current) {
          return <CurrentPage key={index}>{item.label}</CurrentPage>
        }

        return (
          <StyledLink key={index} onClick={() => handleClick(item.href)}>
            {item.label}
          </StyledLink>
        )
      })}
    </StyledBreadcrumbs>
  )
}

export default SimpleBreadcrumbs
