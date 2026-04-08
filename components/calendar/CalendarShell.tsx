'use client';

import React from 'react';
import { useCalendar } from './useCalendar';
import { useRangeSelect } from './useRangeSelect';
import { useNotes } from './useNotes';
import { HeroImage } from './HeroImage';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';
import './calendar.css';

function SpiralBinding() {
  // Generate ring elements for the spiral binding
  const rings = Array.from({ length: 20 }, (_, i) => (
    <div key={i} className="spiral-ring" />
  ));
  return <div className="spiral-binding">{rings}</div>;
}

export function CalendarShell() {
  const { currentMonthDate, nextMonth, prevMonth, days } = useCalendar();
  const { startDate, endDate, handleDateClick, isInRange, isStart, isEnd, isSingle } = useRangeSelect();
  const { notes, addNote, deleteNote, isLoaded } = useNotes();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Calendar...</div>;
  }

  return (
    <div className="w-full max-w-[850px] mx-auto px-4 sm:px-6 pt-10 pb-16 flex flex-col items-center min-h-screen font-sans">
      
      {/* Wall Hook at the top */}
      <div className="wall-hook"></div>

      {/* The Calendar "Page" */}
      <div className="calendar-wrapper w-full">
        
        {/* Spiral Binding Rings */}
        <SpiralBinding />

        {/* TOP HALF: Hero Image */}
        <HeroImage currentDate={currentMonthDate} />

        {/* BOTTOM HALF: Notes (left) + Calendar Grid (right) */}
        <div className="flex flex-col sm:flex-row w-full">
          
          {/* Left: Notes Panel (on desktop), moves below on mobile */}
          <div className="order-2 sm:order-1 sm:w-[240px] sm:min-w-[240px] border-t sm:border-t-0 sm:border-r border-gray-200 bg-white">
            <NotesPanel
              notes={notes}
              startDate={startDate}
              endDate={endDate}
              currentMonthDate={currentMonthDate}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
            />
          </div>
          
          {/* Right: Calendar Grid */}
          <div className="order-1 sm:order-2 flex-1 flex flex-col bg-white">
            <CalendarHeader currentDate={currentMonthDate} onPrev={prevMonth} onNext={nextMonth} />
            <CalendarGrid
              days={days}
              handleDateClick={handleDateClick}
              isInRange={isInRange}
              isStart={isStart}
              isEnd={isEnd}
              isSingle={isSingle}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
