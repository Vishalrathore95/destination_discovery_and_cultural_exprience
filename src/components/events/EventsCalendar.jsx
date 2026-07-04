import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { generateEvents } from '../../services/geminiService';
import { Calendar, Filter, Sparkles, AlertCircle } from 'lucide-react';
import EventCard from './EventCard';

export const EventsCalendar = () => {
  const { destinationGuide, events, setEvents } = useTrip();
  
  const [dateRange, setDateRange] = useState('upcoming month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const destination = destinationGuide?.queryDestination || '';

  const handleFetchEvents = async (e) => {
    e.preventDefault();
    if (!destination) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateEvents(destination, dateRange);
      if (data && data.error) {
        setError(data.error);
      } else {
        setEvents(data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve event calendar.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Festival', 'Workshop', 'Market', 'Performance', 'Community'];
  
  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(e => e.category?.toLowerCase() === selectedCategory.toLowerCase());

  if (!destinationGuide) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
      <div className="glass-panel border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold font-serif-display text-slate-800 dark:text-white mb-2 flex items-center space-x-2">
          <Calendar className="text-indigo-600 dark:text-indigo-400" />
          <span>Authentic Local Events & Workshops</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Discover seasonal festivals, native craft workshops, and community events in {destination}.
        </p>

        {/* Date Selector Form */}
        <form onSubmit={handleFetchEvents} className="flex flex-col sm:flex-row gap-4 items-end sm:items-center mb-6">
          <div className="flex-1 w-full">
            <label htmlFor="date-input" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Select date window / range
            </label>
            <input
              id="date-input"
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="e.g. October, Next weekend, or July 10-20"
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-850 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm shrink-0"
          >
            {loading ? 'Polling Concierge...' : 'Fetch Events'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-orange-50 border border-orange-200 dark:bg-orange-950/40 dark:border-orange-900 text-orange-700 dark:text-orange-300 rounded-lg text-sm mb-6 flex items-start space-x-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Category Filter buttons */}
        {events && events.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase mb-2">
              <Filter size={12} />
              <span>Filter Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedCategory === cat
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300 font-bold'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Events Grid layout */}
        {filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((evt, idx) => (
              <EventCard key={idx} event={evt} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-8 text-slate-450 border border-dashed rounded-lg">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No experiences loaded yet. Click 'Fetch Events' to consult the calendar.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EventsCalendar;
