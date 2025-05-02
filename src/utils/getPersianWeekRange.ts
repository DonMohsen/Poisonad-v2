import { toJalaali } from 'jalaali-js';

// Persian month names
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Convert English digits to Persian
export const toPersianDigits = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
};

// Get Persian week range (Saturday to Friday)
export const getPersianWeekRange = (date: Date): string => {
  // Find Saturday of the current week
  const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const saturday = new Date(date);
  saturday.setDate(date.getDate() - (day + 1) % 7);
  
  // Find Friday (6 days after Saturday)
  const friday = new Date(saturday);
  friday.setDate(saturday.getDate() + 6);

  // Convert to Jalaali
  const satJal = toJalaali(saturday);
  const friJal = toJalaali(friday);

  // Format dates
  const formatDate = (d: { jd: number; jm: number }) => 
    `${toPersianDigits(d.jd)} ${persianMonths[d.jm - 1]}`;

  const start = formatDate(satJal);
  const end = formatDate(friJal);

  // Same month: "۵ تا ۱۱ مرداد"
  if (satJal.jm === friJal.jm) {
    return `${toPersianDigits(satJal.jd)} تا ${toPersianDigits(friJal.jd)} ${persianMonths[satJal.jm - 1]}`;
  }

  // Different months: "۲۹ اسفند تا ۴ فروردین"
  return `${start} تا ${end}`;
};