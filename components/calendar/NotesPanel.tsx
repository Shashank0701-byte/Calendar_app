import React, { useState } from 'react';
import { Note } from './useNotes';

interface NotesPanelProps {
  notes: Note[];
  startDate: string | null;
  endDate: string | null;
  currentMonthDate: Date;
  holidayName?: string;
  onAddNote: (start: string, end: string | null, text: string) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesPanel({ notes, startDate, endDate, currentMonthDate, holidayName, onAddNote, onDeleteNote }: NotesPanelProps) {
  const [text, setText] = useState('');

  // Filter notes to only show ones overlapping the current month
  const currentMonth = currentMonthDate.getMonth();
  const currentYear = currentMonthDate.getFullYear();
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0); // last day of month

  const filteredNotes = notes.filter(note => {
    const noteStart = new Date(note.startDate);
    const noteEnd = new Date(note.endDate);
    // Note overlaps current month if it starts before month ends AND ends after month starts
    return noteStart <= monthEnd && noteEnd >= monthStart;
  });

  const handleSave = () => {
    if (!startDate || !text.trim()) return;
    onAddNote(startDate, endDate, text);
    setText('');
  };

  const getRangeLabel = (start: string, end: string | null) => {
    const sDate = new Date(start);
    const sLabel = `${sDate.toLocaleString('default', { month: 'short' })} ${sDate.getDate()}`;
    if (!end || end === start) return sLabel;
    
    const eDate = new Date(end);
    const eLabel = `${eDate.toLocaleString('default', { month: 'short' })} ${eDate.getDate()}`;
    return `${sLabel} - ${eLabel}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Input Section */}
      <div className="p-4 sm:p-5 pb-2">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
           Notes
        </h3>
        
        {startDate ? (
          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200">
            <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              {getRangeLabel(startDate, endDate)}
            </label>
            {holidayName && (
              <div className="flex items-center gap-1.5 mb-2 px-2 py-1 bg-red-50 border border-red-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></span>
                <span className="text-xs font-semibold text-red-600">{holidayName}</span>
              </div>
            )}
            <textarea
              className="w-full resize-none bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              rows={3}
              placeholder="Jot something down..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label={`Notes for ${getRangeLabel(startDate, endDate)}`}
            />
            <div className="flex justify-end mt-1">
              <button
                onClick={handleSave}
                disabled={!text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 text-center border-dashed border-2 border-gray-200 rounded-xl text-gray-400 text-sm font-medium">
            Select a date range to add notes
          </div>
        )}
      </div>

      {/* Saved Notes Feed */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto">
        <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-200 pb-2">
          Saved Selection Notes
        </h4>
        
        {filteredNotes.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No notes for this month.</p>
        ) : (
           <div className="flex flex-col gap-3">
            {filteredNotes.map(note => (
              <div key={note.id} className="group relative bg-white p-3.5 pb-7 rounded-xl shadow-sm border border-gray-200 hover:border-blue-200 transition-colors w-full break-words">
                 <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                   {getRangeLabel(note.startDate, note.endDate)}
                 </div>
                 <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{note.text}</p>
                 <button
                   onClick={() => onDeleteNote(note.id)}
                   className="absolute bottom-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-50 focus:opacity-100"
                   aria-label="Delete note"
                 >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                   </svg>
                 </button>
              </div>
            ))}
           </div>
        )}
      </div>
    </div>
  );
}
