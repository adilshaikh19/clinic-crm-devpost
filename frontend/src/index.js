import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// AGGRESSIVE ResizeObserver error suppression - This WILL eliminate the error completely
(function() {
  // 1. Override ResizeObserver completely with a safe wrapper
  const OriginalResizeObserver = window.ResizeObserver;
  
  window.ResizeObserver = class SafeResizeObserver {
    constructor(callback) {
      this.callback = callback;
      this.observer = new OriginalResizeObserver((entries, observer) => {
        // Use requestAnimationFrame to prevent loop errors
        window.requestAnimationFrame(() => {
          try {
            this.callback(entries, observer);
          } catch (error) {
            // Silently ignore ResizeObserver errors
            if (!error.message || !error.message.includes('ResizeObserver')) {
              console.error('Non-ResizeObserver error:', error);
            }
          }
        });
      });
    }
    
    observe(...args) {
      return this.observer.observe(...args);
    }
    
    unobserve(...args) {
      return this.observer.unobserve(...args);
    }
    
    disconnect(...args) {
      return this.observer.disconnect(...args);
    }
  };

  // 2. Override console methods to suppress errors
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('ResizeObserver')) return;
    if (message && message.message && message.message.includes('ResizeObserver')) return;
    originalError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('ResizeObserver')) return;
    originalWarn.apply(console, args);
  };

  // 3. Catch all window errors
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('ResizeObserver')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  }, true); // Use capture phase

  // 4. Catch unhandled rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('ResizeObserver')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  // 5. Override React's error handling for development
  if (process.env.NODE_ENV === 'development') {
    const originalReactError = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot;
    if (originalReactError) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = function(...args) {
        try {
          return originalReactError.apply(this, args);
        } catch (error) {
          if (error.message && error.message.includes('ResizeObserver')) {
            return;
          }
          throw error;
        }
      };
    }
  }

  // 6. Monkey patch React's error handling
  const originalCreateRoot = ReactDOM.createRoot;
  ReactDOM.createRoot = function(container, options) {
    const root = originalCreateRoot.call(this, container, options);
    const originalRender = root.render;
    
    root.render = function(element) {
      try {
        return originalRender.call(this, element);
      } catch (error) {
        if (error.message && error.message.includes('ResizeObserver')) {
          return;
        }
        throw error;
      }
    };
    
    return root;
  };
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);