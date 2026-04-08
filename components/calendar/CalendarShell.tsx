'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useCalendar } from './useCalendar';
import { useRangeSelect } from './useRangeSelect';
import { useNotes } from './useNotes';
import { HeroImage } from './HeroImage';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';
import { HOLIDAYS } from './calendarData';
import './calendar.css';

function SpiralBinding() {
  const rings = Array.from({ length: 20 }, (_, i) => (
    <div key={i} className="spiral-ring" />
  ));
  return <div className="spiral-binding">{rings}</div>;
}

export function CalendarShell() {
  const { currentMonthDate, nextMonth, prevMonth, days } = useCalendar();
  const { startDate, endDate, handleDateClick, isInRange, isStart, isEnd, isSingle, clearSelection } = useRangeSelect();
  const { notes, addNote, deleteNote, isLoaded } = useNotes();

  // Page-flip animation state
  const [flipClass, setFlipClass] = useState('');
  const isFlipping = useRef(false);

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    if (isFlipping.current) return;
    isFlipping.current = true;
    
    // Phase 1: Flip out in the correct direction (250ms)
    setFlipClass(`page-flip-out-${direction}`);
    
    setTimeout(() => {
      // Phase 2: Swap content while hidden
      if (direction === 'next') nextMonth();
      else prevMonth();
      
      clearSelection(); // <--- Invalidates state to mimic fresh physical page
      
      // Phase 3: Flip in from the correct direction (300ms)
      setFlipClass(`page-flip-in-${direction}`);
      
      setTimeout(() => {
        // Phase 4: Clean up
        setFlipClass('');
        isFlipping.current = false;
      }, 300);
    }, 250);
  }, [nextMonth, prevMonth]);

  const selectedHoliday = startDate ? HOLIDAYS[startDate] : undefined;

  const hasNoteForDay = useCallback((iso: string) => {
    return notes.some(n => {
      const dayDate = new Date(iso);
      dayDate.setHours(0, 0, 0, 0);
      const start = new Date(n.startDate);
      start.setHours(0, 0, 0, 0);
      if (!n.endDate) return dayDate.getTime() === start.getTime();
      const end = new Date(n.endDate);
      end.setHours(0, 0, 0, 0);
      return dayDate.getTime() >= start.getTime() && dayDate.getTime() <= end.getTime();
    });
  }, [notes]);

  // Global Keyboard Navigation for Month Switching
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in the notes textarea
      if (document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') handleNavigate('prev');
      else if (e.key === 'ArrowRight') handleNavigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate]);

  // 3D Mouse Parallax Tracking
  const calendarRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!calendarRef.current) return;
      const rect = calendarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Normalize to -1 to 1 range, clamped
      const clampX = Math.max(-1, Math.min(1, x / (rect.width / 2)));
      const clampY = Math.max(-1, Math.min(1, y / (rect.height / 2)));

      calendarRef.current.style.setProperty('--mouse-x', clampX.toString());
      calendarRef.current.style.setProperty('--mouse-y', clampY.toString());
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Calendar...</div>;
  }

  return (
    <div className="w-full max-w-[850px] mx-auto px-4 sm:px-6 pt-10 pb-16 flex flex-col items-center min-h-screen font-sans">
      
      {/* Wall Hook at the top */}
      <div className="wall-hook"></div>

      {/* The Calendar "Page" */}
      <div ref={calendarRef} className="calendar-wrapper w-full relative">
        
        {/* Spiral Binding Rings — stays fixed during flip */}
        <SpiralBinding />

        {/* Flippable content area */}
        <div className="page-flip-container">
          <div className={`page-content ${flipClass}`}>

            {/* TOP HALF: Hero Image */}
            <HeroImage currentDate={currentMonthDate} />

            {/* BOTTOM HALF: Notes (left) + Calendar Grid (right) */}
            <div className="flex flex-col sm:flex-row w-full">
              
              {/* Left: Notes Panel */}
              <div className="order-2 sm:order-1 sm:w-[240px] sm:min-w-[240px] border-t sm:border-t-0 sm:border-r border-gray-200 bg-white">
                <NotesPanel
                  notes={notes}
                  startDate={startDate}
                  endDate={endDate}
                  currentMonthDate={currentMonthDate}
                  holidayName={selectedHoliday}
                  onAddNote={addNote}
                  onDeleteNote={deleteNote}
                />
              </div>
              
              {/* Right: Calendar Grid */}
              <div className="order-1 sm:order-2 flex-1 flex flex-col bg-white">
                <CalendarHeader
                  currentDate={currentMonthDate}
                  onPrev={() => handleNavigate('prev')}
                  onNext={() => handleNavigate('next')}
                />
                <CalendarGrid
                  days={days}
                  monthKey={`${currentMonthDate.getFullYear()}-${currentMonthDate.getMonth()}`}
                  handleDateClick={handleDateClick}
                  isInRange={isInRange}
                  isStart={isStart}
                  isEnd={isEnd}
                  isSingle={isSingle}
                  hasNote={hasNoteForDay}
                />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
