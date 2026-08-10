import { useEffect } from 'react';

/**
 * Hook forcing permanent dark theme across the application
 */
export function useTheme() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    localStorage.setItem('webloom-theme', 'dark');
  }, []);

  return { 
    theme: 'dark', 
    toggleTheme: () => {} 
  };
}
