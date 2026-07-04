import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { LANGUAGES } from '../../utils/constants';
import { Menu, X, Sun, Moon, Eye, ZoomIn, Globe } from 'lucide-react';

export const Header = () => {
  const { theme, toggleTheme, fontSize, changeFontSize, language, changeLanguage } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const cycleFontSize = () => {
    if (fontSize === 'normal') changeFontSize('large');
    else if (fontSize === 'large') changeFontSize('extra-large');
    else changeFontSize('normal');
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel shadow-sm transition-theme border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-2 focus:outline-none rounded-lg p-1">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="font-serif-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Cultural Compass <span className="text-orange-600 dark:text-orange-400 font-sans text-sm font-semibold">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Home</Link>
            <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Dashboard</Link>
            <Link to="/saved-trips" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Saved Journeys</Link>
          </nav>

          {/* Settings Toolbar */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-label={`Toggle theme. Current: ${theme}`}
              title="Toggle Theme"
            >
              {theme === 'light' && <Moon size={20} />}
              {theme === 'dark' && <Eye size={20} />}
              {theme === 'high-contrast' && <Sun size={20} />}
            </button>

            {/* Font Size */}
            <button
              onClick={cycleFontSize}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-label={`Adjust text size. Current: ${fontSize}`}
              title="Text Size"
            >
              <ZoomIn size={20} />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen((v) => !v)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors border border-slate-200 dark:border-slate-700"
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
                title="Select Language"
              >
                <Globe size={18} />
                <span className="text-sm font-semibold uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 py-1 z-50"
                  role="listbox"
                >
                  {LANGUAGES.map((lang) => (
                    <li key={lang.code} role="option" aria-selected={language === lang.code}>
                      <button
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors ${
                          language === lang.code
                            ? 'font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-slate-700/50'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {lang.label}
                        {language === lang.code && (
                          <span className="ml-auto text-indigo-500 dark:text-indigo-400">✓</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 px-4 pt-3 pb-5 space-y-3 bg-white dark:bg-slate-900 transition-theme">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 dark:text-slate-200 font-medium">Home</Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 dark:text-slate-200 font-medium">Dashboard</Link>
          <Link to="/saved-trips" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 dark:text-slate-200 font-medium">Saved Journeys</Link>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex flex-wrap gap-3">
            <button onClick={toggleTheme} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 py-1.5 px-3 border border-slate-200 dark:border-slate-700 rounded-lg">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>Theme: {theme}</span>
            </button>
            <button onClick={cycleFontSize} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 py-1.5 px-3 border border-slate-200 dark:border-slate-700 rounded-lg">
              <ZoomIn size={16} />
              <span>Text: {fontSize}</span>
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-semibold">Language</p>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { changeLanguage(lang.code); setMobileMenuOpen(false); }}
                  className={`text-left text-sm py-2 px-3 rounded-lg border transition-colors ${
                    language === lang.code
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
