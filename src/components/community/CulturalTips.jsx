import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { Lightbulb, Check, AlertCircle, Compass } from 'lucide-react';

export const CulturalTips = () => {
  const { destinationGuide } = useTrip();
  const [tips, setTips] = useState([
    { category: 'Etiquette', text: 'Bow slightly when greeting elders to express respect.' },
    { category: 'Clothing', text: 'Always cover shoulders and knees before entering inner temple courtyards.' },
    { category: 'Tipping', text: 'Tipping is not customary here; outstanding service is best rewarded with sincere verbal appreciation.' }
  ]);
  const [inputTip, setInputTip] = useState('');
  const [category, setCategory] = useState('Etiquette');

  if (!destinationGuide) return null;

  const handleAddTip = (e) => {
    e.preventDefault();
    if (!inputTip.trim()) return;

    setTips(prev => [...prev, { category, text: inputTip.trim() }]);
    setInputTip('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
          <Lightbulb className="text-orange-500" />
          <span>Local Wisdom Exchange</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Submit or browse short local advice snippets for respectful travel.
        </p>

        {/* Input box */}
        <form onSubmit={handleAddTip} className="flex flex-col sm:flex-row gap-3 mb-6 items-end">
          <div className="w-full sm:w-1/4">
            <label htmlFor="tip-category" className="sr-only">Tip Category</label>
            <select
              id="tip-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-700 text-xs font-semibold"
            >
              <option value="Etiquette">Etiquette</option>
              <option value="Clothing">Dress Code</option>
              <option value="Tipping">Dining & Tipping</option>
              <option value="Bargaining">Shopping</option>
            </select>
          </div>

          <div className="flex-1 w-full relative">
            <label htmlFor="tip-input" className="sr-only">Tip Description</label>
            <input
              id="tip-input"
              type="text"
              required
              placeholder="e.g. Remove footwear at threshold entries..."
              value={inputTip}
              onChange={(e) => setInputTip(e.target.value)}
              className="w-full pl-3 pr-3 py-2 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shrink-0 transition-colors shadow-sm"
          >
            Submit Tip
          </button>
        </form>

        {/* Display Tips Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tips.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded mb-3 tracking-wider">
                  {t.category}
                </span>
                <p className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center space-x-1 mt-4 text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                <Check size={12} />
                <span>Verified Guidelines</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CulturalTips;
