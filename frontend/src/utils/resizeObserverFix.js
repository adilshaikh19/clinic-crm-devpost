// Comprehensive ResizeObserver error suppression utility
// This is a common React issue that doesn't affect functionality

const suppressResizeObserverError = () => {
  // Multiple approaches to catch all ResizeObserver errors
  
  // 1. Override console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const errorMessage = args[0];
    if (isResizeObserverError(errorMessage)) return;
    originalError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const warnMessage = args[0];
    if (isResizeObserverError(warnMessage)) return;
    originalWarn.apply(console, args);
  };
  
  // 2. Override ResizeObserver constructor if available
  if (typeof ResizeObserver !== 'undefined') {
    const OriginalResizeObserver = ResizeObserver;
    window.ResizeObserver = class extends OriginalResizeObserver {
      constructor(callback) {
        super((entries, observer) => {
          try {
            callback(entries, observer);
          } catch (error) {
            if (!isResizeObserverError(error.message)) {
              throw error;
            }
          }
        });
      }
    };
  }
};

const handleResizeObserverError = () => {
  // Global error handlers
  window.addEventListener('error', (event) => {
    if (isResizeObserverError(event.message)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && isResizeObserverError(event.reason.message)) {
      event.preventDefault();
    }
  });
};

// Helper function to identify ResizeObserver errors
const isResizeObserverError = (message) => {
  if (!message) return false;
  if (typeof message === 'string') {
    return message.includes('ResizeObserver loop completed with undelivered notifications') ||
           message.includes('ResizeObserver loop limit exceeded');
  }
  if (message.message) {
    return message.message.includes('ResizeObserver loop completed with undelivered notifications') ||
           message.message.includes('ResizeObserver loop limit exceeded');
  }
  return false;
};

// Debounced ResizeObserver wrapper
const createDebounceResizeObserver = (callback, delay = 16) => {
  let timeoutId;
  return new ResizeObserver((entries, observer) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      try {
        callback(entries, observer);
      } catch (error) {
        if (!isResizeObserverError(error.message)) {
          console.error('ResizeObserver callback error:', error);
        }
      }
    }, delay);
  });
};

export { 
  suppressResizeObserverError, 
  handleResizeObserverError, 
  createDebounceResizeObserver,
  isResizeObserverError 
};