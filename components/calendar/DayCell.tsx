import React, { useState, useEffect, useRef } from 'react';
import { CalendarDay } from './useCalendar';

interface DayCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isSingle: boolean;
  hasNote?: boolean;
  staggerIndex: number;
  monthKey: string;
  onClick: (dateStr: string, shiftKey: boolean) => void;
  holidayName?: string;
}

export function DayCell({
  day,
  isStart,
  isEnd,
  isInRange,
  isSingle,
  hasNote = false,
  staggerIndex,
  monthKey,
  onClick,
  holidayName
}: DayCellProps) {
  const [showCircle, setShowCircle] = useState(hasNote);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    if (hasNote && !showCircle) {
      setShowCircle(true);
      setIsErasing(false);
    } else if (!hasNote && showCircle && !isErasing) {
      setIsErasing(true);
      setTimeout(() => {
        setIsErasing(false);
        setShowCircle(false);
      }, 350);
    }
  }, [hasNote, showCircle, isErasing]);

  // Mobile Long-Press Logic
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [longPressFired, setLongPressFired] = useState(false);

  const handleTouchStart = () => {
    setLongPressFired(false);
    timerRef.current = setTimeout(() => {
      onClick(day.isoString, true);
      setLongPressFired(true);
      timerRef.current = null;
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (longPressFired) {
      setLongPressFired(false);
      e.preventDefault();
      return;
    }
    onClick(day.isoString, e.shiftKey);
  };

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
      key={monthKey}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`${classes.join(' ')} day-cell-enter relative context-menu-none select-none`}
      style={{ '--stagger-delay': `${staggerIndex * 15}ms` } as React.CSSProperties}
      aria-label={label}
      aria-pressed={isStart || isEnd || isSingle}
      title={holidayName || label}
      disabled={day.isOverflow}
    >
      <span className="z-10 relative">{day.date.getDate()}</span>
      
      {/* Hand-drawn SVG marker */}
      {(isSingle || showCircle || isErasing) && (
        <svg className={`absolute inset-0 w-full h-full scale-[1.3] pointer-events-none ${hasNote || showCircle ? 'text-red-600' : 'text-blue-600'}`} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M 35,18 C 15,22 8,40 12,65 C 15,85 35,94 62,90 C 85,86 98,65 93,40 C 88,15 60,6 40,12 C 25,16 10,35 15,45"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            vectorEffect="non-scaling-stroke"
            className={isErasing ? 'erase-line' : 'hand-drawn-line'}
            pathLength="1"
          />
        </svg>
      )}

      {holidayName && !isStart && !isEnd && !isSingle && !showCircle && (
        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-400"></span>
      )}
    </button>
  );
}
