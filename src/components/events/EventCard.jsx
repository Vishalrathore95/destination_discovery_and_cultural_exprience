import React, { useState } from 'react';
import { Calendar, Tag, ShieldCheck, ExternalLink, Ticket } from 'lucide-react';
import ExperienceBooking from './ExperienceBooking';

export const EventCard = ({ event }) => {
  const [bookingOpen, setBookingOpen] = useState(false);

  if (!event) return null;

  return (
    <div className="border rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="space-y-4">
        {/* Category Header */}
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 tracking-wide">
            <Tag size={12} className="text-indigo-500" />
            <span>{event.category}</span>
          </span>
          <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
            <Calendar size={12} />
            <span>{event.date}</span>
          </span>
        </div>

        {/* Name and Description */}
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white leading-snug">
            {event.eventName}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-1.5">
            {event.description}
          </p>
        </div>

        {/* Cultural Context */}
        <div className="space-y-1.5 pt-2 border-t text-[11px]">
          <div className="text-slate-650 dark:text-slate-400">
            <span className="font-bold block text-slate-800 dark:text-slate-250">Cultural Value:</span>
            <span>{event.culturalValue}</span>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900 mt-2 text-emerald-850 dark:text-emerald-300">
            <span className="font-bold flex items-center space-x-1 mb-0.5">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>Visitor Participation Guidelines:</span>
            </span>
            <span>{event.visitorParticipation}</span>
          </div>
        </div>
      </div>

      {/* Footer Booking Buttons */}
      <div className="pt-4 flex items-center space-x-2">
        <button
          onClick={() => setBookingOpen(true)}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-lg shadow-sm transition-all focus:ring-1 focus:ring-indigo-500"
        >
          <Ticket size={14} />
          <span>Book Experience</span>
        </button>
        {event.bookingTip && (
          <div className="text-[10px] text-slate-400 dark:text-slate-500 text-right italic shrink-0 max-w-[120px] leading-tight">
            Tip: {event.bookingTip}
          </div>
        )}
      </div>

      {bookingOpen && (
        <ExperienceBooking
          event={event}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
};

export default EventCard;
