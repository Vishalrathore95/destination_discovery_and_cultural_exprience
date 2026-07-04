import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { generateItinerary } from '../../services/geminiService';
import { Calendar, Compass, ShieldCheck, Soup, Sun, AlertTriangle } from 'lucide-react';

export const ItineraryGenerator = () => {
  const { destinationGuide, itinerary, setItinerary } = useTrip();
  
  const [duration, setDuration] = useState(3);
  const [interests, setInterests] = useState('heritage sites, culinary workshops, local craft markets');
  const [budget, setBudget] = useState('mid-range');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const destination = destinationGuide?.queryDestination || '';
  const style = destinationGuide?.queryStyle || 'historical';

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!destination) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateItinerary(destination, duration, interests, budget, style);
      if (data && data.error) {
        setError(data.error);
      } else {
        setItinerary(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate itinerary.');
    } finally {
      setLoading(false);
    }
  };

  if (!destinationGuide) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
          <Calendar className="text-indigo-650" />
          <span>AI Cultural Itinerary Maker</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Generate an authentic day-by-day plan custom built for local immersion in {destination}.
        </p>

        {/* Setup Parameters Form */}
        <form onSubmit={handleGenerate} className="space-y-4 mb-6 bg-slate-50 dark:bg-slate-950/20 p-4 border rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Days duration */}
            <div>
              <label htmlFor="duration-input" className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1">
                Duration (Days)
              </label>
              <select
                id="duration-input"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-700 text-xs font-semibold"
              >
                {[1, 2, 3, 4, 5, 7].map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? 'Day' : 'Days'}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget options */}
            <div>
              <label htmlFor="budget-select" className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1">
                Budget Level
              </label>
              <select
                id="budget-select"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-700 text-xs font-semibold"
              >
                <option value="budget">Budget (Eco/Hostel) 🎒</option>
                <option value="mid-range">Mid-Range (Local Inns) 🏨</option>
                <option value="luxury">Luxury (Heritage stays) 👑</option>
              </select>
            </div>

            {/* Detailed Interests */}
            <div>
              <label htmlFor="interests-input" className="block text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-1">
                Custom Interests
              </label>
              <input
                id="interests-input"
                type="text"
                required
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. food pairing, temple history"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-orange-50 border border-orange-200 dark:bg-orange-950/40 dark:border-orange-900 text-orange-700 dark:text-orange-300 rounded-lg text-xs flex items-center space-x-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              {loading ? 'Synthesizing Itinerary...' : 'Generate Itinerary'}
            </button>
          </div>
        </form>

        {/* Display generated itinerary */}
        {loading && (
          <div className="text-center py-12 text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-semibold animate-pulse">Drafting hourly cultural layout...</p>
          </div>
        )}

        {!loading && itinerary && (
          <div className="space-y-6 animate-fade-in border-t pt-6">
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border rounded-xl mb-4">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-0.5">Overview</span>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-350 italic">
                "{itinerary.overview}"
              </p>
            </div>

            {/* Daily plans rendering */}
            <div className="space-y-6">
              {itinerary.dailyPlan?.map((dayPlan, index) => (
                <div key={index} className="p-5 border rounded-xl bg-white dark:bg-slate-900 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Day {dayPlan.day}: {dayPlan.theme}
                    </span>
                  </div>

                  {/* Hourly activities */}
                  <div className="space-y-3.5">
                    {dayPlan.activities?.map((act, actIdx) => (
                      <div key={actIdx} className="flex gap-4 items-start">
                        <span className="w-20 text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 shrink-0 pt-0.5">
                          {act.time}
                        </span>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{act.activity}</span>
                          <span className="text-[10px] text-slate-500 block leading-relaxed italic">{act.culturalSignificance}</span>
                          {act.practicalTip && (
                            <span className="text-[10px] text-orange-600 dark:text-orange-400 block font-semibold">Tip: {act.practicalTip}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meal and evening details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 text-xs">
                    {dayPlan.localMealSuggestion && (
                      <div className="flex items-start space-x-2">
                        <Soup className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-750 dark:text-slate-300 block mb-0.5">Meal suggestion:</span>
                          <span className="text-slate-650 dark:text-slate-400 leading-normal">{dayPlan.localMealSuggestion}</span>
                        </div>
                      </div>
                    )}
                    {dayPlan.eveningExperience && (
                      <div className="flex items-start space-x-2">
                        <Sun className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-750 dark:text-slate-300 block mb-0.5">Evening Experience:</span>
                          <span className="text-slate-650 dark:text-slate-400 leading-normal">{dayPlan.eveningExperience}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Respectful tips footer */}
            {itinerary.respectfulTravelTips && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-2">
                <span className="text-xs font-bold text-emerald-805 uppercase tracking-wider block">
                  Cultural Stewardship Warnings:
                </span>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-emerald-705 dark:text-emerald-300">
                  {itinerary.respectfulTravelTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryGenerator;
