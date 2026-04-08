import { useState, useCallback } from 'react';

export function useRangeSelect() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDateClick = useCallback((dateIso: string, shiftKey: boolean) => {
    // Shift+Click = extend to range from current start
    if (shiftKey && startDate && !endDate) {
      if (new Date(dateIso) < new Date(startDate)) {
        // Clicked before start — make this the new start, old start becomes end
        setEndDate(startDate);
        setStartDate(dateIso);
      } else if (dateIso !== startDate) {
        setEndDate(dateIso);
      }
      return;
    }

    // Normal click = always select just that single date
    setStartDate(dateIso);
    setEndDate(null);
  }, [startDate, endDate]);

  const isInRange = useCallback((dateIso: string) => {
    if (!startDate || !endDate) return false;
    return new Date(dateIso) > new Date(startDate) && new Date(dateIso) < new Date(endDate);
  }, [startDate, endDate]);

  const isStart = useCallback((dateIso: string) => dateIso === startDate, [startDate]);
  
  const isEnd = useCallback((dateIso: string) => dateIso === endDate, [endDate]);
  
  const isSingle = useCallback(
    (dateIso: string) => dateIso === startDate && !endDate,
    [startDate, endDate]
  );

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
