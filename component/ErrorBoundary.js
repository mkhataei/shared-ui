import React, { Component } from 'react';
import { isForbiddenError, isNotFoundError } from '@shared/utils/axiosSetup';
import ErrorPage from '@shared/components/ErrorPage';

/**
 * Error Boundary component to catch and display errors
 * Specifically handles 403 Forbidden and 404 Not Found errors with custom messages
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Check if it's a 403 error
      if (isForbiddenError(this.state.error)) {
        return <ErrorPage statusCode={403} />;
      }

      // Check if it's a 404 error
      if (isNotFoundError(this.state.error)) {
        return <ErrorPage statusCode={404} />;
      }

      // Generic error UI for other errors (500)
      return <ErrorPage statusCode={500} error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
