import React from 'react';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { TRANSLATIONS } from '../../utils/constants';
import { Compass, Sparkles, MapPin, EyeOff } from 'lucide-react';

export const HiddenGems = ({ onSelectGem }) => {
  const { destinationGuide } = useTrip();
  const { language } = useTheme();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!destinationGuide || !destinationGuide.hiddenGems) return null;

  const { hiddenGems } = destinationGuide;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold font-serif-display text-slate-800 dark:text-white mb-6 border-b pb-2 flex items-center space-x-2">
        <EyeOff className="text-orange-600 dark:text-orange-400" />
        <span>{t.hiddenGemsTitle}</span>
      </h2>

      <div className="space-y-6">
        {hiddenGems.map((gem, index) => (
          <div
            key={index}
            className="glass-panel border rounded-xl p-6 shadow-sm hover:shadow transition-shadow flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6"
          >
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sparkles size={16} className="text-orange-500" />
                  <span>{gem.name}</span>
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                  [Off the beaten track]
                </p>
              </div>

              <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
                {gem.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Why It's Special:</span>
                  <span className="text-slate-650 dark:text-slate-400 leading-normal">{gem.whySpecial}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Local Significance:</span>
                  <span className="text-slate-650 dark:text-slate-400 leading-normal">{gem.localSignificance}</span>
                </div>
              </div>

              {gem.howToFind && (
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 p-2.5 rounded-md">
                  <MapPin size={14} className="text-indigo-500 shrink-0" />
                  <span className="font-medium">How to find: {gem.howToFind}</span>
                </div>
              )}
            </div>

            <div className="flex items-end justify-end shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => onSelectGem(gem.name)}
                className="w-full md:w-auto flex items-center justify-center space-x-1.5 py-2.5 px-5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <Compass size={14} />
                <span>Explore Local Lore</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiddenGems;
