import React from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function CalendarHeader({ currentDate, onPrev, onNext }: CalendarHeaderProps) {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
        {monthName} <span className="font-medium text-gray-400 ml-1">{year}</span>
      </h2>
      <div className="flex gap-1 md:gap-2">
        <button 
          onClick={onPrev} 
          className="p-2 sm:p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-full"
          aria-label="Previous month"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button 
          onClick={onNext} 
          className="p-2 sm:p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-full"
          aria-label="Next month"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
