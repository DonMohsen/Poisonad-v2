import dayjs from 'dayjs';
import jalaliday from 'jalaliday';

export const convertToPersianNumber = (input: string): string => {
    const persianNumbers: Record<string, string> = {
      '0': '۰',
      '1': '۱',
      '2': '۲',
      '3': '۳',
      '4': '۴',
      '5': '۵',
      '6': '۶',
      '7': '۷',
      '8': '۸',
      '9': '۹',
    };
  
    return input.split('').map(char => persianNumbers[char] || char).join('');
  };

/**
 * Persian month names
 */
const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];
//!Persian full date::::::::::::::::::::::::::::
// lib/utils/date.ts

dayjs.extend(jalaliday);

const persianMonthNames = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

/**
 * Converts a "YYYY-MM-DD" string to Persian date in format "17 اردیبهشت 1404"
 */
const persianWeekdayNames = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
  'شنبه',
];

export function convertToPersianWeekday(input: string): string {
  const jDate = dayjs(input).calendar('jalali');
  const weekday = persianWeekdayNames[jDate.day()];
 
  return `${weekday}`;
}
// utils/convertPersianDate.ts

export function convertToPersianDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("/")

  const monthIndex = parseInt(month, 10) - 1
  const monthName = persianMonths[monthIndex] || ""

  return ` ${parseInt(day)} ${monthName} ${year}`
}
