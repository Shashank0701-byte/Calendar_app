import { useState, useMemo } from 'react';

export interface CalendarDay {
  date: Date;
  isOverflow: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isoString: string;
}

export function useCalendar() {
  // Always initialize to the first day of the current month
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const days = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    // JS dates: 0 is Sunday, 1 is Monday.
    // For a Monday-first calendar, we adjust the offset.
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;
    
    // Go backward to find the exact Monday to start on
    const startDate = new Date(year, month, 1 - startingDayOfWeek);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const generatedDays: CalendarDay[] = [];
    
    // Exactly 42 cells (6 rows of 7 days)
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        
        // Ensure consistent YYYY-MM-DD locally formatted without strict relying on toISOString() 
        // to avoid timezone drift
        const yearStr = currentDate.getFullYear();
        const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(currentDate.getDate()).padStart(2, '0');
        const isoString = `${yearStr}-${monthStr}-${dayStr}`;

        generatedDays.push({
            date: currentDate,
            isOverflow: currentDate.getMonth() !== month,
            isToday: currentDate.getTime() === today.getTime(),
            isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
            isoString
        });
    }

    return generatedDays;
  }, [currentMonthDate]);

  return {
    currentMonthDate,
    nextMonth,
    prevMonth,
    days
  };
}
