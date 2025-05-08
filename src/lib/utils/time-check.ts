// lib/utils/isPastDate.ts
import dayjs from 'dayjs';

/**
 * Checks if a given "YYYY-MM-DD" Gregorian date is in the past (before today).
 * @param inputDate - Date string in "YYYY-MM-DD" format
 * @returns true if the date is before today, false otherwise
 */
export function isPastDate(inputDate: string): boolean {
  const today = dayjs().startOf('day');
  const input = dayjs(inputDate).startOf('day');

  return input.isBefore(today, 'day');
}
