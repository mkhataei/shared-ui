import withRouter from '@shared/fuse/core/withRouter'
import FuseUtils from '@shared/fuse/utils'
import history from '@shared/history/'
import AppContext from 'app/AppContext'
import { Component } from 'react'
import { matchRoutes } from 'react-router-dom'

let loginRedirectUrl = null

class FuseAuthorization extends Component {
  constructor(props, context) {
    super(props)
    const { routes } = context
    this.state = {
      accessGranted: true,
      routes,
    }
    this.defaultLoginRedirectUrl = props.loginRedirectUrl || '/'
  }

  componentDidMount() {
    if (!this.state.accessGranted) {
      this.redirectRoute()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted
  }

  componentDidUpdate() {
    if (!this.state.accessGranted) {
      this.redirectRoute()
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { location, user } = props
    const { pathname } = location

    const matchedRoutes = matchRoutes(state.routes, pathname)

    const matched = matchedRoutes ? matchedRoutes[0] : false

    // console.log('permissions', matched.route.permissions)
    // console.log('hasPermission', FuseUtils.hasPermission(matched.route.permissions, user))
    return {
      accessGranted: matched ? FuseUtils.hasPermission(matched.route.permissions, user) : true,
    }
  }

  redirectRoute() {
    const { location, user } = this.props
    const { pathname } = location
    const redirectUrl = loginRedirectUrl || this.defaultLoginRedirectUrl

    if (!FuseUtils.getPermissionsFromUser(user)) {
      /**
       * User is guest
       * Redirect to Login Page
       */
      setTimeout(() => history.push('/login'), 0)
      if (pathname !== '/logout') {
        loginRedirectUrl = pathname
      } else {
        loginRedirectUrl = this.defaultLoginRedirectUrl
      }
    } else {
      /**
       * User is member
       * User must be on unAuthorized page or just logged in
       * Redirect to dashboard or loginRedirectUrl
       */
      setTimeout(() => history.push(redirectUrl), 0)
      loginRedirectUrl = this.defaultLoginRedirectUrl
    }
  }

  render() {
    // console.info('Fuse Authorization rendered', this.state.accessGranted)
    return this.state.accessGranted ? <>{this.props.children}</> : null
  }
}

FuseAuthorization.contextType = AppContext

export default withRouter(FuseAuthorization)
