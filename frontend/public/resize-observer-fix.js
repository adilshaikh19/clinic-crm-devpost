// Nuclear option: Completely replace ResizeObserver with a safe version
// This script runs before React loads to prevent ANY ResizeObserver errors

(function() {
  'use strict';
  
  // Store the original ResizeObserver
  const OriginalResizeObserver = window.ResizeObserver;
  
  // Create a completely safe ResizeObserver replacement
  window.ResizeObserver = class SafeResizeObserver {
    constructor(callback) {
      this.callback = callback;
      this.entries = [];
      this.isObserving = false;
      
      // Use a debounced approach with RAF to prevent loops
      this.debouncedCallback = this.debounce(() => {
        if (this.entries.length > 0 && this.isObserving) {
          try {
            // Use RAF to ensure we're not in a layout loop
            requestAnimationFrame(() => {
              try {
                this.callback(this.entries, this);
                this.entries = [];
              } catch (error) {
                // Silently ignore all errors from ResizeObserver callbacks
                console.debug('ResizeObserver callback error suppressed:', error.message);
              }
            });
          } catch (error) {
            // Silently ignore
          }
        }
      }, 16);
      
      // Create the actual observer with error handling
      try {
        this.observer = new OriginalResizeObserver((entries) => {
          this.entries = entries;
          this.debouncedCallback();
        });
      } catch (error) {
        // Fallback: create a mock observer
        this.observer = {
          observe: () => {},
          unobserve: () => {},
          disconnect: () => {}
        };
      }
    }
    
    observe(target, options) {
      this.isObserving = true;
      try {
        return this.observer.observe(target, options);
      } catch (error) {
        // Silently fail
      }
    }
    
    unobserve(target) {
      try {
        return this.observer.unobserve(target);
      } catch (error) {
        // Silently fail
      }
    }
    
    disconnect() {
      this.isObserving = false;
      this.entries = [];
      try {
        return this.observer.disconnect();
      } catch (error) {
        // Silently fail
      }
    }
    
    // Debounce utility
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };
  
  // Override console methods to suppress any remaining errors
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && message.includes('ResizeObserver')) {
      return; // Completely suppress
    }
    if (message && message.message && message.message.includes('ResizeObserver')) {
      return; // Completely suppress
    }
    return originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && message.includes('ResizeObserver')) {
      return; // Completely suppress
    }
    return originalWarn.apply(console, args);
  };
  
  // Global error suppression
  window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('ResizeObserver')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);
  
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && event.reason.message.includes('ResizeObserver')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  
  console.log('ResizeObserver error suppression loaded');
})();