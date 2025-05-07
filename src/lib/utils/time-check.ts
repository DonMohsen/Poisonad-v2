// lib/utils/isNotToday.ts
import dayjs from 'dayjs';

/**
 * Checks if a given "YYYY-MM-DD" Gregorian date is NOT today.
 * @param inputDate - Date string in "YYYY-MM-DD" format
 * @returns true if the date is not today, false if it is today
 */
export function isNotToday(inputDate: string): boolean {
  const today = dayjs().startOf('day');
  const input = dayjs(inputDate).startOf('day');

  return !input.isSame(today, 'day');
}
