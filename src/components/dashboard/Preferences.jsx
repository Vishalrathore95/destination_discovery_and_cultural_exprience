import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LANGUAGES } from '../../utils/constants';
import { Eye, Sun, Moon, Volume2, ZoomIn } from 'lucide-react';

export const Preferences = () => {
  const { theme, setTheme, fontSize, changeFontSize, language, changeLanguage } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-900 transition-theme animate-fade-in">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold font-serif-display text-slate-900 dark:text-white">Accessibility & Theme</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Customize the platform appearance, font scale factor, language translations, and audio read-out options.
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
          <div className="glass-panel border rounded-xl p-6 shadow-sm space-y-6">
            
            {/* Theme mode settings */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Display Mode</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light Mode', icon: Sun },
                  { value: 'dark', label: 'Dark Mode', icon: Moon },
                  { value: 'high-contrast', label: 'High Contrast', icon: Eye }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.value}
                      onClick={() => setTheme(item.value)}
                      className={`flex flex-col items-center p-3 border rounded-xl text-xs font-semibold transition-all ${
                        theme === item.value
                          ? 'border-indigo-650 bg-indigo-50 text-indigo-750 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'border-slate-300 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font scale adjustment */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Text Scaling</h3>
              <div className="flex gap-2">
                {[
                  { value: 'normal', label: 'Normal (100%)' },
                  { value: 'large', label: 'Large (115%)' },
                  { value: 'extra-large', label: 'Extra Large (130%)' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => changeFontSize(opt.value)}
                    className={`px-4 py-2 border rounded-lg text-xs font-semibold transition-all ${
                      fontSize === opt.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-750 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'border-slate-300 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language translation preferences */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preferred Language</h3>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="block w-full sm:w-1/2 px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-905 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:outline-none text-sm"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
