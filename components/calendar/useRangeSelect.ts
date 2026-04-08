import { useState, useCallback } from 'react';

export function useRangeSelect() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDateClick = useCallback((dateIso: string) => {
    // Stage 1: No dates selected -> Set Start
    if (!startDate) {
      setStartDate(dateIso);
      setEndDate(null);
      return;
    }

    // Stage 2: Start is set, End is not set
    if (startDate && !endDate) {
      // If user clicked backward, reset selection to start at the new date
      if (new Date(dateIso) < new Date(startDate)) {
        setStartDate(dateIso);
        setEndDate(null);
      } else {
        // Correct forward click -> setEnd
        setEndDate(dateIso);
      }
      return;
    }

    // Stage 3: Both are set -> Reset and start over
    setStartDate(dateIso);
    setEndDate(null);
  }, [startDate, endDate]);

  const isInRange = useCallback((dateIso: string) => {
    if (!startDate || !endDate) return false;
    return new Date(dateIso) > new Date(startDate) && new Date(dateIso) < new Date(endDate);
  }, [startDate, endDate]);

  const isStart = useCallback((dateIso: string) => dateIso === startDate, [startDate]);
  
  const isEnd = useCallback((dateIso: string) => dateIso === endDate, [endDate]);
  
  // single day range selection check (start and end clicked on the same date)
  const isSingle = useCallback((dateIso: string) => isStart(dateIso) && isEnd(dateIso), [isStart, isEnd]);

  const clearSelection = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  return {
    startDate,
    endDate,
    handleDateClick,
    isInRange,
    isStart,
    isEnd,
    isSingle,
    clearSelection,
  };
}
