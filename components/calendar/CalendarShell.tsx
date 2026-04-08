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

export function CalendarShell() {
  const { currentMonthDate, nextMonth, prevMonth, days } = useCalendar();
  const { startDate, endDate, handleDateClick, isInRange, isStart, isEnd, isSingle } = useRangeSelect();
  const { notes, addNote, deleteNote, isLoaded } = useNotes();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Calendar...</div>;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-start min-h-screen font-sans">
      
      {/* 
        Responsive layout implementation
        Mobile (<640px): 1 col (stacked)
        Tablet (640-1023px): 2 col -> Left: Image/Grid stacked, Right: Notes
        Desktop (>=1024px): 3 col -> Left: Image, Center: Grid, Right: Notes
      */}
      <div className="calendar-wrapper grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_300px] lg:grid-cols-[300px_minmax(0,1fr)_280px] xl:grid-cols-[320px_minmax(0,1fr)_320px] w-full min-h-[650px]">
        
        {/* Left Side: Hero Image */}
        <div className="sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1 w-full bg-gray-100 flex flex-col relative z-0">
          <HeroImage currentDate={currentMonthDate} />
        </div>

        {/* Center: Grid Column */}
        {/* On sm/tablet it's beneath Hero Image (col:1, row:2). On lg it's col:2, row:1 */}
        <div className="sm:col-start-1 sm:row-start-2 lg:col-start-2 lg:row-start-1 w-full bg-white flex flex-col relative z-10 border-r border-gray-100">
          <div className="h-6 w-full spiral-binding z-20 hidden sm:block lg:hidden xl:block"></div>
          {/* Note: I only conditionally render the inner spiral-binding string based on visual balance for specific column sizes so it merges with the hero image's boundary constraints nicely */}
          
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

        {/* Right Side: Notes Panel */}
        {/* On sm/tablet it takes the right column and spans both rows (image & grid). lg: col-start-3 row-span-1 */}
        <div className="sm:col-start-2 sm:row-start-1 sm:row-span-2 lg:col-start-3 lg:row-start-1 lg:row-span-1 w-full bg-gray-50 flex flex-col relative z-10 border-t sm:border-t-0 sm:border-l border-gray-100">
          <div className="h-6 w-full spiral-binding z-20 hidden sm:block"></div>
          <NotesPanel 
            notes={notes}
            startDate={startDate}
            endDate={endDate}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
          />
        </div>

      </div>

    </div>
  );
}
