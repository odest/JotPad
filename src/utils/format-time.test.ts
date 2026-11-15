import { en } from '@/i18n/en';
import { tr } from '@/i18n/tr';

import { formatDay, formatListStamp, formatTime, isSameDay } from './format-time';

const EN = { t: en, locale: 'en-US' };
const TR = { t: tr, locale: 'tr-TR' };

// Local-time dates, so the tests hold in any time zone.
const at = (y: number, month: number, d: number, h = 12, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime();

// Wednesday, 15 July 2026.
const NOW = at(2026, 7, 15, 14, 30);

describe('isSameDay', () => {
  it('is true within a calendar day, even across the evening', () => {
    expect(isSameDay(at(2026, 7, 15, 0, 1), at(2026, 7, 15, 23, 59))).toBe(true);
  });

  it('is false for neighbouring days a minute apart', () => {
    expect(isSameDay(at(2026, 7, 15, 23, 59), at(2026, 7, 16, 0, 1))).toBe(false);
  });
});

describe('formatTime', () => {
  it('writes a 24 hour clock for Turkish', () => {
    expect(formatTime(at(2026, 7, 15, 14, 5), 'tr-TR')).toBe('14:05');
  });

  it('pads the hour', () => {
    expect(formatTime(at(2026, 7, 15, 9, 5), 'tr-TR')).toBe('09:05');
  });
});

describe('formatDay', () => {
  it('names today and yesterday in the chosen language', () => {
    expect(formatDay(at(2026, 7, 15, 8), EN, NOW)).toBe('Today');
    expect(formatDay(at(2026, 7, 14, 22), EN, NOW)).toBe('Yesterday');
    expect(formatDay(at(2026, 7, 15, 8), TR, NOW)).toBe(tr.time.today);
    expect(formatDay(at(2026, 7, 14, 22), TR, NOW)).toBe(tr.time.yesterday);
  });

  it('uses the weekday for the rest of the week', () => {
    // Monday, two days before NOW.
    expect(formatDay(at(2026, 7, 13), EN, NOW)).toBe('Monday');
    expect(formatDay(at(2026, 7, 13), TR, NOW)).toBe('Pazartesi');
  });

  it('uses the full date from a week ago', () => {
    expect(formatDay(at(2026, 7, 8), EN, NOW)).toBe('July 8, 2026');
    expect(formatDay(at(2026, 7, 8), TR, NOW)).toBe('8 Temmuz 2026');
  });

  it('counts calendar days, not 24 hour spans', () => {
    // 23:50 yesterday is yesterday even though it was under 24 hours before NOW.
    expect(formatDay(at(2026, 7, 14, 23, 50), EN, at(2026, 7, 15, 0, 10))).toBe('Yesterday');
  });
});

describe('formatListStamp', () => {
  it('shows the time for today', () => {
    expect(formatListStamp(at(2026, 7, 15, 9, 5), TR, NOW)).toBe('09:05');
  });

  it('shows "Yesterday" for yesterday', () => {
    expect(formatListStamp(at(2026, 7, 14), EN, NOW)).toBe('Yesterday');
  });

  it('shows a short weekday within the week', () => {
    expect(formatListStamp(at(2026, 7, 13), EN, NOW)).toBe('Mon');
  });

  it('shows a short date from a week ago', () => {
    expect(formatListStamp(at(2026, 7, 1), EN, NOW)).toBe('Jul 1');
  });
});
