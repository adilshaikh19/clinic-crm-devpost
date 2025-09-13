import { useState, useEffect } from 'react';

// Custom hook to debounce values and reduce rapid state changes
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook to debounce layout changes specifically
export const useDebouncedLayout = (isCollapsed, delay = 150) => {
  return useDebounce(isCollapsed, delay);
};