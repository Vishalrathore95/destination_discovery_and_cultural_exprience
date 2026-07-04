import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { generateFoodPairings } from '../../services/geminiService';
import { UtensilsCrossed, Sparkles, CheckSquare, Compass } from 'lucide-react';

export const FoodPairing = () => {
  const { destinationGuide } = useTrip();
  
  const [selectedSite, setSelectedSite] = useState('');
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!destinationGuide) return null;

  const sites = [...(destinationGuide.topAttractions || []), ...(destinationGuide.hiddenGems || [])];

  const handleEvokeFood = async () => {
    if (!selectedSite) return;
    setLoading(true);
    setDishes([]);

    try {
      const data = await generateFoodPairings(destinationGuide.queryDestination, selectedSite);
      if (data && !data.error) setDishes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in font-sans">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
          <UtensilsCrossed className="text-indigo-650" />
          <span>Cultural Culinary Pairing</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Pair your visits with local foods. Recommends traditional dishes, local histories, and simple home recipes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <div className="flex-1 w-full">
            <label htmlFor="food-site-select" className="sr-only">Select Visited Site</label>
            <select
              id="food-site-select"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-700 text-xs font-semibold"
            >
              <option value="">-- Select Visited Site --</option>
              {sites.map((s, idx) => (
                <option key={idx} value={s.name}>
                  {s.name} ({s.category || 'Local Gem'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleEvokeFood}
            disabled={loading || !selectedSite}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shrink-0 shadow-sm"
          >
            {loading ? 'Consulting local recipes...' : 'Find Culinary Matches'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-400">Loading food chronicles...</p>
          </div>
        )}

        {!loading && dishes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t pt-6">
            {dishes.map((dish, idx) => (
              <div
                key={idx}
                className="p-5 border rounded-xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                      <Sparkles size={14} className="text-orange-500" />
                      <span>{dish.dishName}</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{dish.description}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed font-sans bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-dashed">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Cultural Significance:</span>
                    <span>{dish.culturalSignificance}</span>
                  </div>

                  {/* Ingredients bullet list */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Key Ingredients:</span>
                    <ul className="space-y-0.5 pl-3 list-disc text-[10px] text-slate-650 dark:text-slate-400">
                      {dish.ingredients?.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t text-[10px] text-slate-550 dark:text-slate-450">
                  <span className="font-bold block text-slate-850 dark:text-slate-305">Where to find or cook:</span>
                  <span>{dish.whereToFind}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodPairing;
