'use client';

import { useEffect } from 'react';
import { useUIStore } from '../store/UIStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useUIStore();

  useEffect(() => {
    // On mount, read saved theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    const themeToUse = savedTheme || systemTheme;

    // Apply theme to HTML element
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(themeToUse);

    // Update store if needed
    if (themeToUse !== theme) {
      useUIStore.setState({ theme: themeToUse });
    }
  }, []);

  // Apply theme whenever it changes in the store
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
