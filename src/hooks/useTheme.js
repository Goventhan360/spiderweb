import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check local storage or system preference on initial load
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('webloom-theme');
      if (saved) return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    // Apply the theme to the HTML tag
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('webloom-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
