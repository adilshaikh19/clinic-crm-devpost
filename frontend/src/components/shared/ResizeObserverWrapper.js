import React, { useEffect, useRef } from 'react';
import { createDebounceResizeObserver } from '../../utils/resizeObserverFix';

const ResizeObserverWrapper = ({ children, onResize, debounceDelay = 16 }) => {
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !onResize) return;

    // Create a debounced ResizeObserver to prevent loop errors
    observerRef.current = createDebounceResizeObserver((entries) => {
      try {
        onResize(entries);
      } catch (error) {
        // Silently handle ResizeObserver errors
        console.debug('ResizeObserver callback error handled:', error.message);
      }
    }, debounceDelay);

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onResize, debounceDelay]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

export default ResizeObserverWrapper;