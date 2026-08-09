import { Person } from '../types';

/**
 * Parses month and day from an annualDate string (YYYY-MM-DD or MM-DD)
 */
export function parseMonthAndDay(annualDateStr: string): { month: number; day: number; birthYear?: number } {
  if (!annualDateStr) return { month: 0, day: 1 };
  
  const parts = annualDateStr.split('-').map(p => parseInt(p, 10));
  
  if (parts.length === 3) {
    // YYYY-MM-DD
    return { birthYear: parts[0], month: parts[1] - 1, day: parts[2] };
  } else if (parts.length === 2) {
    // MM-DD
    return { month: parts[0] - 1, day: parts[1] };
  }
  
  const d = new Date(annualDateStr);
  if (!isNaN(d.getTime())) {
    return { birthYear: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }
  
  return { month: 0, day: 1 };
}

/**
 * Calculates the next annual occurrence of a date relative to reference date (default now)
 */
export function getNextOccurrence(annualDateStr: string, referenceDate: Date = new Date()): Date {
  const { month, day } = parseMonthAndDay(annualDateStr);
  const now = new Date(referenceDate);
  now.setHours(0, 0, 0, 0);

  let targetYear = now.getFullYear();
  
  // Handle Leap Year adjustment for Feb 29
  let targetDay = day;
  if (month === 1 && day === 29) {
    const isLeapYear = (targetYear % 4 === 0 && targetYear % 100 !== 0) || (targetYear % 400 === 0);
    if (!isLeapYear) targetDay = 28;
  }

  let nextDate = new Date(targetYear, month, targetDay);
  nextDate.setHours(0, 0, 0, 0);

  // If already passed this year, move to next year
  if (nextDate.getTime() < now.getTime()) {
    targetYear += 1;
    if (month === 1 && day === 29) {
      const isLeapYear = (targetYear % 4 === 0 && targetYear % 100 !== 0) || (targetYear % 400 === 0);
      targetDay = isLeapYear ? 29 : 28;
    }
    nextDate = new Date(targetYear, month, targetDay);
    nextDate.setHours(0, 0, 0, 0);
  }

  return nextDate;
}

/**
 * Calculates the exact number of days remaining until the next annual date
 */
export function getDaysRemaining(annualDateStr: string, referenceDate: Date = new Date()): number {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  
  const nextOccurrence = getNextOccurrence(annualDateStr, today);
  const diffTime = nextOccurrence.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Formats days remaining into human-readable Arabic text
 */
export function formatDaysRemainingText(days: number): string {
  if (days === 0) return 'اليوم!';
  if (days === 1) return 'غداً';
  if (days === 2) return 'بعد يومين';
  if (days >= 3 && days <= 10) return `بعد ${days} أيام`;
  return `بعد ${days} يوماً`;
}

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

/**
 * Formats the annual date into an Arabic string (e.g. "15 أغسطس")
 */
export function formatAnnualDateArabic(annualDateStr: string): string {
  const { month, day } = parseMonthAndDay(annualDateStr);
  const monthName = ARABIC_MONTHS[month] || '';
  return `${day} ${monthName}`;
}

/**
 * Formats full current date with Arabic Hijri & Gregorian representations
 */
export function getFormattedTodayArabic(): { gregorian: string; hijri: string; weekday: string } {
  const now = new Date();
  
  const weekdays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const weekday = weekdays[now.getDay()];

  const day = now.getDate();
  const month = ARABIC_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  const gregorian = `${day} ${month} ${year} م`;

  let hijri = '';
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijri = formatter.format(now) + ' هـ';
  } catch {
    hijri = '';
  }

  return { gregorian, hijri, weekday };
}

/**
 * Sorts people chronologically by upcoming reminder days remaining
 */
export function sortPeopleByUpcoming(people: Person[]): Person[] {
  const now = new Date();
  return [...people].sort((a, b) => {
    const daysA = getDaysRemaining(a.annualDate, now);
    const daysB = getDaysRemaining(b.annualDate, now);
    return daysA - daysB;
  });
}
