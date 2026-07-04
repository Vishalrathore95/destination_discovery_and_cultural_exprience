import React from 'react';

export const LoadingSpinner = ({ message = 'Consulting local chronicles...' }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      {/* Decorative Outer Rings */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-950 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        {/* Inner Compass Needle Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-400 font-serif-display font-medium text-lg tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
