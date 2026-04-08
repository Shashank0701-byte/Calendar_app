import React from 'react';
import { CalendarDay } from './useCalendar';
import { DayCell } from './DayCell';
import { WEEK_DAYS, HOLIDAYS } from './calendarData';

interface CalendarGridProps {
  days: CalendarDay[];
  handleDateClick: (iso: string) => void;
  isInRange: (iso: string) => boolean;
  isStart: (iso: string) => boolean;
  isEnd: (iso: string) => boolean;
  isSingle: (iso: string) => boolean;
}

export function CalendarGrid({
  days,
  handleDateClick,
  isInRange,
  isStart,
  isEnd,
  isSingle
}: CalendarGridProps) {
  return (
    <div className="p-4 sm:p-6 bg-white flex-grow">
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 mb-3">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-bold tracking-widest text-gray-400 uppercase py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Days Grid: 7 columns, 6 rows */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-0 sm:gap-y-3">
        {days.map((day, idx) => {
          return (
            <DayCell
              key={`${day.isoString}-${idx}`}
              day={day}
              isStart={isStart(day.isoString)}
              isEnd={isEnd(day.isoString)}
              isInRange={isInRange(day.isoString)}
              isSingle={isSingle(day.isoString)}
              onClick={handleDateClick}
              holidayName={HOLIDAYS[day.isoString]}
            />
          );
        })}
      </div>
    </div>
  );
}
