import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Aggressively suppress ALL ResizeObserver related errors
    const errorMessage = error?.message || error?.toString() || '';
    if (
      errorMessage.includes('ResizeObserver') ||
      errorMessage.includes('resize observer') ||
      errorMessage.includes('loop completed with undelivered notifications') ||
      errorMessage.includes('loop limit exceeded')
    ) {
      // Completely ignore ResizeObserver errors - don't even log them
      return null;
    }
    
    // Update state for other errors
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Suppress ALL ResizeObserver related errors
    const errorMessage = error?.message || error?.toString() || '';
    if (
      errorMessage.includes('ResizeObserver') ||
      errorMessage.includes('resize observer') ||
      errorMessage.includes('loop completed with undelivered notifications') ||
      errorMessage.includes('loop limit exceeded')
    ) {
      // Completely suppress - no logging
      return;
    }
    
    // Log only non-ResizeObserver errors
    console.error('Error caught by boundary:', error, errorInfo);
  }

  componentDidMount() {
    // Additional error suppression at component level
    window.addEventListener('error', this.handleWindowError, true);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection, true);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleWindowError, true);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection, true);
  }

  handleWindowError = (event) => {
    const message = event.message || event.error?.message || '';
    if (message.includes('ResizeObserver')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  };

  handleUnhandledRejection = (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    if (message.includes('ResizeObserver')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              An error occurred while loading the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;