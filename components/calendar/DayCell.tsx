import React from 'react';
import { CalendarDay } from './useCalendar';

interface DayCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isSingle: boolean;
  onClick: (dateStr: string) => void;
  holidayName?: string;
}

export function DayCell({
  day,
  isStart,
  isEnd,
  isInRange,
  isSingle,
  onClick,
  holidayName
}: DayCellProps) {
  // Compute classes based on visual states defined in skills mapping
  const classes = [
    'day-cell', 
    'relative', 
    'flex', 
    'flex-col', 
    'items-center', 
    'justify-center', 
    'w-full', 
    'h-10', 
    'sm:h-12', 
    'text-sm', 
    'transition-all',
    'duration-100',
    'rounded-lg', // baseline shape
  ];

  if (day.isOverflow) classes.push('day--overflow', 'opacity-50');
  else classes.push('day--default', 'cursor-pointer');

  if (day.isWeekend && !day.isOverflow) classes.push('day--weekend');
  if (day.isToday) classes.push('day--today');
  
  if (isSingle) classes.push('day--single');
  else if (isStart) classes.push('day--start', 'rounded-r-none', 'z-10');
  else if (isEnd) classes.push('day--end', 'rounded-l-none', 'z-10');
  else if (isInRange) classes.push('day--in-range', 'rounded-none');

  const monthName = day.date.toLocaleString('default', { month: 'long' });
  const label = `${day.date.getDate()} ${monthName} ${day.date.getFullYear()}`;

  return (
    <button
      onClick={() => onClick(day.isoString)}
      className={classes.join(' ')}
      aria-label={label}
      aria-pressed={isStart || isEnd || isSingle}
      title={holidayName || label}
      disabled={day.isOverflow}
    >
      <span className="z-10">{day.date.getDate()}</span>
      {holidayName && !isStart && !isEnd && !isSingle && (
        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-400"></span>
      )}
    </button>
  );
}
