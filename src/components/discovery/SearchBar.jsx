import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { generateDestinationGuide } from '../../services/geminiService';
import { validateSearchQuery } from '../../utils/validators';
import { TRAVEL_STYLES, SEASONS, TRANSLATIONS } from '../../utils/constants';
import { Compass, Search, MapPin } from 'lucide-react';

export const SearchBar = () => {
  const { setDestinationGuide, setItinerary, setEvents } = useTrip();
  const { language } = useTheme();
  
  const [destination, setDestination] = useState('');
  const [style, setStyle] = useState('historical');
  const [season, setSeason] = useState('spring');
  
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [apiError, setApiError] = useState(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);

    // Validate
    const errorMsg = validateSearchQuery(destination);
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setLoading(true);
    // Clear previous search contexts to refresh view
    setDestinationGuide(null);
    setItinerary(null);
    setEvents([]);

    try {
      const data = await generateDestinationGuide(destination, style, season);
      if (data && data.error) {
        setApiError(data.error);
      } else {
        setDestinationGuide({ ...data, queryDestination: destination, queryStyle: style, querySeason: season });
      }
    } catch (err) {
      setApiError(err.message || 'An error occurred during guide generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="glass-panel border rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Compass className="w-6 h-6 animate-float" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white">
              {t.heroTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.heroSubtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Input query */}
            <div className="md:col-span-1 relative">
              <label htmlFor="destination-input" className="sr-only">Destination Name</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin size={18} />
              </div>
              <input
                id="destination-input"
                type="text"
                required
                placeholder={t.searchPlaceholder}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-theme"
              />
            </div>

            {/* Travel Style Selector */}
            <div>
              <label htmlFor="style-select" className="sr-only">Travel Style</label>
              <select
                id="style-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="block w-full px-3 py-3 border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-theme"
              >
                {TRAVEL_STYLES.map((styleOpt) => (
                  <option key={styleOpt.value} value={styleOpt.value}>
                    {styleOpt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time of year season selection */}
            <div>
              <label htmlFor="season-select" className="sr-only">Time of Year</label>
              <select
                id="season-select"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="block w-full px-3 py-3 border border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-theme"
              >
                {SEASONS.map((seasonOpt) => (
                  <option key={seasonOpt.value} value={seasonOpt.value}>
                    {seasonOpt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation/API error display */}
          {validationError && (
            <p className="text-sm font-semibold text-red-650 dark:text-red-400 mt-1" role="alert">
              {validationError}
            </p>
          )}
          {apiError && (
            <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-1" role="alert">
              {apiError}
            </p>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 shadow-md transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  <span>{t.loadingText}</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>{t.discoverBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
