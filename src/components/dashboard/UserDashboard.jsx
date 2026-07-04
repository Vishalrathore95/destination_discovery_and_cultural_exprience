import React, { useState, useEffect } from 'react';
import { useTrip } from '../../context/TripContext';
import { Compass, BookOpen, Star, Sparkles, Award, Map, Calendar, ShieldCheck, Footprints } from 'lucide-react';
import SavedTrips from './SavedTrips';

export const UserDashboard = () => {
  const user = null; // No auth required - guest mode
  const { savedTrips } = useTrip();
  
  const [bookings, setBookings] = useState([]);
  const [trackerStats, setTrackerStats] = useState({
    culturalIndex: 65, // out of 100
    sitesLearned: 3,
    vocabularyCount: 8,
    impactPledges: 1
  });

  useEffect(() => {
    // Read bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('cc_mock_bookings') || '[]');
    setBookings(savedBookings);

    // Dynamic stats based on activity
    setTrackerStats({
      culturalIndex: 40 + (savedTrips.length * 10) + (savedBookings.length * 15),
      sitesLearned: savedTrips.length * 5 || 2,
      vocabularyCount: 5 + (savedTrips.length * 3),
      impactPledges: savedBookings.length || 1
    });
  }, [savedTrips]);

  const welcomeName = user ? (user.displayName || user.email.split('@')[0]) : 'Traveler';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8 bg-slate-50 dark:bg-slate-900 transition-theme">
      {/* Welcome Hero header */}
      <div className="glass-panel border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
        <div>
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-850 dark:bg-indigo-950 dark:text-indigo-300 mb-2 uppercase tracking-wide">
            Explorer Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-display text-slate-900 dark:text-white">
            Welcome back, {welcomeName} 🧭
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your journeys, check booked workshop schedules, and review your cultural footprints.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-4 py-2.5 rounded-xl text-amber-850 dark:text-amber-300">
          <Award className="w-6 h-6 text-amber-500 animate-float" />
          <div>
            <span className="text-[10px] block font-semibold uppercase tracking-widest text-amber-500">Steward Rank</span>
            <span className="text-xs font-extrabold">Cultural Ambassador</span>
          </div>
        </div>
      </div>

      {/* Grid: Stats and Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cultural Impact Tracker */}
        <div className="lg:col-span-1 glass-panel border rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif-display text-slate-800 dark:text-white flex items-center space-x-2">
              <Footprints className="text-orange-500" />
              <span>Cultural Impact Tracker</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Your progress in respectful cultural immersion.</p>
          </div>

          {/* Progress Circular Gauge */}
          <div className="flex flex-col items-center justify-center py-4 relative">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer gauge border */}
              <div className="absolute inset-0 rounded-full border-[8px] border-slate-100 dark:border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-[8px] border-t-indigo-650 border-r-indigo-500 border-b-indigo-400 border-l-transparent animate-spin-slow"></div>
              <div className="text-center">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-white block leading-none">
                  {trackerStats.culturalIndex}%
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1 block">Immersion</span>
              </div>
            </div>
          </div>

          {/* Stats details list */}
          <div className="grid grid-cols-3 gap-2 border-t pt-4 text-center">
            <div className="p-2 bg-slate-50 dark:bg-slate-950/20 rounded-lg">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block">{trackerStats.sitesLearned}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Sites Saved</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-950/20 rounded-lg">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block">{trackerStats.vocabularyCount}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Terms Saved</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-950/20 rounded-lg">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block">{trackerStats.impactPledges}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Pledges Signed</span>
            </div>
          </div>
        </div>

        {/* Booked Events Section */}
        <div className="lg:col-span-2 glass-panel border rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold font-serif-display text-slate-800 dark:text-white flex items-center space-x-2">
              <Calendar className="text-indigo-650" />
              <span>Your Booked Experiences</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Local events and workshops you have reserved.</p>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 border rounded-xl bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-white leading-tight">
                      {booking.eventName}
                    </h3>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-medium">
                      <span>Date: {booking.date}</span>
                      <span>•</span>
                      <span>Tickets: {booking.tickets}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center space-x-1 text-[9px] font-bold uppercase tracking-wider text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 px-2 py-0.5 border rounded">
                    <ShieldCheck size={10} />
                    <span>Confirmed</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 border border-dashed rounded-xl text-center text-slate-400 dark:text-slate-500">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.25]" />
              <p className="text-sm font-medium">No bookings yet. Explore and register for local workshops!</p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Trips List Component */}
      <SavedTrips />
    </div>
  );
};

export default UserDashboard;
