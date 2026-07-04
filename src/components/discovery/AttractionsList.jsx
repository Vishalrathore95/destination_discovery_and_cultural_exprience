import React from 'react';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { TRANSLATIONS } from '../../utils/constants';
import { getPlaceholderImage, getSvgFallback } from '../../utils/helpers';
import { Clock, Tag, BookOpen, AlertCircle } from 'lucide-react';

export const AttractionsList = ({ onSelectAttraction }) => {
  const { destinationGuide } = useTrip();
  const { language } = useTheme();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!destinationGuide || !destinationGuide.topAttractions) return null;

  const { topAttractions } = destinationGuide;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold font-serif-display text-slate-800 dark:text-white mb-6 border-b pb-2 flex items-center space-x-2">
        <BookOpen className="text-indigo-600 dark:text-indigo-400" />
        <span>{t.attractionsTitle}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topAttractions.map((attraction, index) => {
          const categoryKey = attraction.category || 'general';
          const cardImage = getPlaceholderImage(categoryKey);

          return (
            <div
              key={index}
              className="glass-panel border rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between"
            >
              <div>
                {/* Micro Thumbnail Banner */}
                <div className="h-40 w-full relative">
                  <img
                    src={cardImage}
                    alt={attraction.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getSvgFallback(categoryKey);
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {attraction.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                    {attraction.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed mb-4">
                    {attraction.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-450 border-t pt-3 mb-4">
                    <span className="flex items-center space-x-1.5">
                      <Clock size={14} className="text-indigo-500" />
                      <span>{attraction.estimatedTime}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Tag size={14} className="text-orange-500" />
                      <span>{attraction.entryFee}</span>
                    </span>
                  </div>

                  {/* Local Tip Box */}
                  {attraction.culturalTip && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 p-3 rounded-r-lg flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-855 dark:text-amber-300 italic font-sans leading-relaxed">
                        {attraction.culturalTip}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-2">
                <button
                  onClick={() => onSelectAttraction(attraction.name)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-4 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-55/20 text-xs font-bold rounded-lg transition-all"
                  aria-label={`View interactive storytelling for ${attraction.name}`}
                >
                  <BookOpen size={14} />
                  <span>Reveal History & Legend</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttractionsList;
