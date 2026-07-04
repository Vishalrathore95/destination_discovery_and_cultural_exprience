import React from 'react';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { getPlaceholderImage, getSvgFallback } from '../../utils/helpers';
import { Map, Trash2, ArrowRight } from 'lucide-react';

export const SavedTrips = () => {
  const { savedTrips, tripsLoading, deleteTrip, setDestinationGuide } = useTrip();

  if (tripsLoading) {
    return <div className="text-center py-6 text-slate-500">Retrieving saved trips...</div>;
  }

  return (
    <div className="w-full glass-panel border rounded-2xl p-6 shadow-sm animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-bold font-serif-display text-slate-800 dark:text-white flex items-center space-x-2">
          <Map className="text-indigo-655" />
          <span>Saved Cultural Journeys</span>
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Restore previously generated guides or remove outdated trips.</p>
      </div>

      {savedTrips && savedTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedTrips.map((trip) => {
            const styleKey = trip.queryStyle || 'general';
            const cardBg = getPlaceholderImage(styleKey);

            return (
              <div
                key={trip.id}
                className="border rounded-xl overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-855 shadow-sm flex flex-col justify-between"
              >
                {/* Thumbnail Header */}
                <div className="h-28 w-full relative">
                  <img
                    src={cardBg}
                    alt={trip.queryDestination}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getSvgFallback(styleKey);
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40"></div>
                  <span className="absolute bottom-2 left-3 text-white text-xs font-bold font-serif-display">
                    {trip.queryDestination}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Style: {trip.queryStyle || 'historical'}</span>
                    <span>Season: {trip.querySeason || 'spring'}</span>
                  </div>
                  
                  {trip.overview && (
                    <p className="text-[11px] text-slate-650 dark:text-slate-350 line-clamp-2">
                      {trip.overview.description}
                    </p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="px-4 pb-4 flex items-center gap-2 border-t pt-3 mt-2">
                  <button
                    onClick={() => setDestinationGuide(trip)}
                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-semibold rounded-md shadow-sm transition-all"
                  >
                    <span>Load Guide</span>
                    <ArrowRight size={12} />
                  </button>

                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="p-1.5 border border-red-250 text-red-650 rounded-md hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
                    title="Delete saved trip"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 border border-dashed rounded-xl text-center text-slate-400 dark:text-slate-500">
          <Map className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.25]" />
          <p className="text-sm font-medium">Your journal is currently empty. Start discovering places to add logs!</p>
        </div>
      )}
    </div>
  );
};

export default SavedTrips;
