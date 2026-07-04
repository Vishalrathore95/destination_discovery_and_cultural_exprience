import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { TRANSLATIONS } from '../../utils/constants';
import { getPlaceholderImage, getSvgFallback } from '../../utils/helpers';
import { Bookmark, Calendar, Globe, Sparkles } from 'lucide-react';

export const DestinationCard = () => {
  const { destinationGuide, saveTrip, savedTrips } = useTrip();
  const { language } = useTheme();
  const [saved, setSaved] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!destinationGuide) return null;

  const { overview, queryDestination, queryStyle } = destinationGuide;
  const isAlreadySaved = savedTrips.some(
    (trip) => trip.queryDestination?.toLowerCase() === queryDestination?.toLowerCase()
  );

  const handleSaveTrip = async () => {
    try {
      await saveTrip(destinationGuide);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save trip:", err);
    }
  };

  const styleKey = queryStyle || 'general';
  const bannerImage = getPlaceholderImage(styleKey);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-2xl overflow-hidden shadow-lg transition-theme">
        {/* Banner Graphic */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={bannerImage}
            alt={queryDestination}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getSvgFallback(styleKey);
            }}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:justify-between sm:items-end">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-850 mb-2 uppercase tracking-wide">
                {queryStyle} travel
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-display text-white tracking-tight">
                {queryDestination}
              </h1>
            </div>
            
            <button
              onClick={handleSaveTrip}
              disabled={isAlreadySaved || saved}
              className={`mt-4 sm:mt-0 flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isAlreadySaved || saved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-white hover:bg-slate-100 text-slate-900 hover:scale-105'
              }`}
            >
              <Bookmark size={16} />
              <span>{isAlreadySaved || saved ? 'Journey Bookmarked' : t.saveTripBtn}</span>
            </button>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white flex items-center space-x-2 border-b pb-2">
              <Globe className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
              <span>Cultural Context</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-350 text-base leading-relaxed font-sans">
              {overview.description}
            </p>
          </div>

          <div className="space-y-4 md:border-l md:pl-6 border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Calendar size={14} className="text-orange-500" />
                <span>Best Season</span>
              </h3>
              <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">
                {overview.bestTimeToVisit}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles size={14} className="text-indigo-500" />
                <span>Heritage Impact</span>
              </h3>
              <p className="text-slate-800 dark:text-slate-200 text-sm font-medium">
                {overview.culturalSignificance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
