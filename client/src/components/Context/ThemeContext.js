import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    // Check system preference if no saved preference
    if (saved === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem('app-theme', JSON.stringify(isDark));
    applyTheme(isDark);
  }, [isDark]);

  const applyTheme = (dark) => {
    if (dark) {
      // Dark mode colors
      document.documentElement.style.setProperty('--bg-primary', '#0f172a');
      document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
      document.documentElement.style.setProperty('--bg-tertiary', '#334155');
      document.documentElement.style.setProperty('--bg-hover', '#475569');
      document.documentElement.style.setProperty('--text-primary', '#f8fafc');
      document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
      document.documentElement.style.setProperty('--text-tertiary', '#94a3b8');
      document.documentElement.style.setProperty('--border-color', '#334155');
      document.documentElement.style.setProperty('--border-light', '#475569');
      document.documentElement.style.setProperty('--shadow-sm', '0 1px 2px rgba(0, 0, 0, 0.5)');
      document.documentElement.style.setProperty('--shadow-md', '0 4px 6px rgba(0, 0, 0, 0.3)');
      document.body.classList.add('dark-mode');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f8fafc';
    } else {
      // Light mode colors
      document.documentElement.style.setProperty('--bg-primary', '#ffffff');
      document.documentElement.style.setProperty('--bg-secondary', '#f8fafc');
      document.documentElement.style.setProperty('--bg-tertiary', '#f1f5f9');
      document.documentElement.style.setProperty('--bg-hover', '#e2e8f0');
      document.documentElement.style.setProperty('--text-primary', '#0f172a');
      document.documentElement.style.setProperty('--text-secondary', '#64748b');
      document.documentElement.style.setProperty('--text-tertiary', '#94a3b8');
      document.documentElement.style.setProperty('--border-color', '#e2e8f0');
      document.documentElement.style.setProperty('--border-light', '#f1f5f9');
      document.documentElement.style.setProperty('--shadow-sm', '0 1px 2px rgba(0, 0, 0, 0.05)');
      document.documentElement.style.setProperty('--shadow-md', '0 4px 6px rgba(0, 0, 0, 0.1)');
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0f172a';
    }
  };

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

