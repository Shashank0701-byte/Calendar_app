import { useState, useEffect, useCallback } from 'react';

export interface Note {
  id: string;
  startDate: string;
  endDate: string; // If single day, this matches startDate
  text: string;
  createdAt: number;
}

const STORAGE_KEY = 'wall-calendar::notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial local storage hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse calendar notes", err);
    }
    setIsLoaded(true);
  }, []);

  const addNote = useCallback((startDate: string, endDate: string | null, text: string) => {
    if (!text.trim()) return;

    setNotes(prev => {
      const newNote: Note = {
        // crypto.randomUUID fallback for older browser environments if needed, but next.js generally handles it
        // using simple random generation fallback
        id: typeof crypto !== 'undefined' && crypto.randomUUID 
              ? crypto.randomUUID() 
              : Math.random().toString(36).substring(2, 11),
        startDate,
        endDate: endDate || startDate,
        text: text.trim(),
        createdAt: Date.now(),
      };
      
      const updated = [newNote, ...prev].sort((a, b) => b.createdAt - a.createdAt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    notes,
    isLoaded,
    addNote,
    deleteNote
  };
}
