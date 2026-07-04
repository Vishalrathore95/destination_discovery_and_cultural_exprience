import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('cc_theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('cc_font_size', 'normal');
  const [language, setLanguage] = useLocalStorage('cc_language', 'en');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Manage theme class names
    root.classList.remove('dark', 'high-contrast');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('high-contrast');
    }

    // Manage accessibility font scaling factor
    let scale = '1';
    if (fontSize === 'large') scale = '1.15';
    if (fontSize === 'extra-large') scale = '1.3';
    root.style.setProperty('--font-scale', scale);
  }, [theme, fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'high-contrast';
      return 'light';
    });
  };

  const changeFontSize = (size) => {
    if (['normal', 'large', 'extra-large'].includes(size)) {
      setFontSize(size);
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        fontSize,
        changeFontSize,
        language,
        changeLanguage
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
