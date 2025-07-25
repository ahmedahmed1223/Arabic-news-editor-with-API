
'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';

type Theme = 'zinc' | 'slate' | 'stone' | 'gray' | 'blue' | 'green' | 'orange';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  radius: number;
  setRadius: (radius: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
};

const initialState: ThemeProviderState = {
  theme: 'blue',
  setTheme: () => null,
  radius: 0.5,
  setRadius: () => null,
  fontSize: 16,
  setFontSize: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'blue',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });
  
  const [radius, setRadiusState] = useState<number>(() => {
    if (typeof window === 'undefined') return 0.5;
    return parseFloat(localStorage.getItem(`${storageKey}-radius`) || '0.5');
  });

  const [fontSize, setFontSizeState] = useState<number>(() => {
    if (typeof window === 'undefined') return 16;
    return parseInt(localStorage.getItem(`${storageKey}-font-size`) || '16', 10);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-zinc', 'theme-slate', 'theme-stone', 'theme-gray', 'theme-blue', 'theme-green', 'theme-orange');
    if (theme) {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };
  
  const setRadius = (newRadius: number) => {
      localStorage.setItem(`${storageKey}-radius`, newRadius.toString());
      setRadiusState(newRadius);
  };

  const setFontSize = (newSize: number) => {
      localStorage.setItem(`${storageKey}-font-size`, newSize.toString());
      setFontSizeState(newSize);
  };
  
  const value = useMemo(() => ({
    theme,
    setTheme,
    radius,
    setRadius,
    fontSize,
    setFontSize
  }), [theme, radius, fontSize]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
