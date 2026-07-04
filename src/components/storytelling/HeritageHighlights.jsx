import React from 'react';
import { useTrip } from '../../context/TripContext';
import { ShieldCheck, HeartHandshake, Compass } from 'lucide-react';

export const HeritageHighlights = () => {
  const { destinationGuide } = useTrip();

  if (!destinationGuide || !destinationGuide.travelTips) return null;

  const { travelTips } = destinationGuide;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-4 border-b pb-2 flex items-center space-x-2">
          <HeartHandshake className="text-orange-550 dark:text-orange-400" />
          <span>Cultural Stewardship & Travel Etiquette</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {travelTips.map((tip, index) => {
            let label = "Etiquette Rule";
            let iconColor = "text-amber-500";
            if (index === 1) {
              label = "Transportation Insight";
              iconColor = "text-indigo-500";
            }
            if (index === 2) {
              label = "Stewardship Do's & Don'ts";
              iconColor = "text-emerald-500";
            }

            return (
              <div
                key={index}
                className="p-4 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <ShieldCheck className={`w-5 h-5 ${iconColor}`} />
                    <span className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {tip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeritageHighlights;
