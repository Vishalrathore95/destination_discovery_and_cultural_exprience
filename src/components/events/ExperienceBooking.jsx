import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Ticket } from 'lucide-react';

export const ExperienceBooking = ({ event, onClose }) => {
  const [tickets, setTickets] = useState(1);
  const [fullName, setFullName] = useState('');
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState(null);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!pledgeChecked) {
      setError('You must read and agree to the Cultural Respect Pledge.');
      return;
    }

    // Save mock booking to localStorage to demonstrate functionality persistence
    const currentBookings = JSON.parse(localStorage.getItem('cc_mock_bookings') || '[]');
    currentBookings.push({
      id: `booking_${Date.now()}`,
      eventName: event.eventName,
      date: event.date,
      tickets,
      fullName,
      bookedAt: new Date().toISOString()
    });
    localStorage.setItem('cc_mock_bookings', JSON.stringify(currentBookings));

    setBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel border rounded-xl w-full max-w-md shadow-2xl p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Close modal"
        >
          ✕
        </button>

        {!booked ? (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-0.5">
                Register Booking
              </span>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white leading-snug">
                {event.eventName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Scheduled: {event.date}</p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 text-red-750 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900 rounded text-xs">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="booking-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">
                Full Name of Registrant
              </label>
              <input
                id="booking-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="ticket-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1">
                Quantity of Tickets
              </label>
              <select
                id="ticket-select"
                value={tickets}
                onChange={(e) => setTickets(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'ticket' : 'tickets'}
                  </option>
                ))}
              </select>
            </div>

            {/* Cultural Respect Pledge Box */}
            <div className="bg-amber-50/50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-250 border-dashed space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300">
                <ShieldAlert size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Respectful Tourist Pledge</span>
              </div>
              <p className="text-[10px] text-amber-900 dark:text-amber-300 leading-relaxed">
                By booking, I pledge to respect local norms, follow photography restrictions, dress modestly if visiting sacred temples, minimize ecological waste, and support local businesses.
              </p>
              <label className="flex items-center space-x-2 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pledgeChecked}
                  onChange={(e) => setPledgeChecked(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>I understand and accept this pledge.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Ticket size={14} />
              <span>Confirm Reservation</span>
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reservation Confirmed!</h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
                Your tickets are registered. A copy of the Cultural Respect guidelines has been logged to your dashboard.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg"
            >
              Return to Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceBooking;
