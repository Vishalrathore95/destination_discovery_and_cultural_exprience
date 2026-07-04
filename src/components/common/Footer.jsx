import React from 'react';
import { TRANSLATIONS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';

export const Footer = () => {
  const { language } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 transition-theme mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright Information */}
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="text-sm font-medium font-serif-display text-slate-800 dark:text-slate-300">
              © {currentYear} Cultural Compass AI. All rights reserved.
            </span>
          </div>

          {/* Links for Guidelines, Privacy, and Responsible Travel */}
          <nav className="flex space-x-6 text-sm">
            <a href="#responsible" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Responsible Tourism</a>
            <a href="#sensitivity" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sensitivity Guidelines</a>
            <a href="#terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
          </nav>

          {/* Accessibility compliance tag */}
          <div className="text-xs text-slate-400 dark:text-slate-500">
            WCAG 2.1 AA Compliant Platform
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
