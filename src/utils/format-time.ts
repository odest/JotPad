import { type Strings } from '@/i18n';

/** What formatting needs from the language: from `useT()` and `useLocale()`. */
export type Formatting = { t: Strings; locale: string };

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function isSameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b);
}

/** Clock time, e.g. "14:05". */
export function formatTime(timestamp: number, locale: string): string {
  return new Date(timestamp).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Day heading for a conversation: "Today", "Yesterday", a weekday, or a full date. */
export function formatDay(timestamp: number, { t, locale }: Formatting, now = Date.now()): string {
  const daysAgo = Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY);
  if (daysAgo === 0) return t.time.today;
  if (daysAgo === 1) return t.time.yesterday;
  const date = new Date(timestamp);
  if (daysAgo < 7) return date.toLocaleDateString(locale, { weekday: 'long' });
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Compact stamp for list rows: the time today, otherwise the day. */
export function formatListStamp(
  timestamp: number,
  { t, locale }: Formatting,
  now = Date.now(),
): string {
  if (isSameDay(timestamp, now)) return formatTime(timestamp, locale);
  const daysAgo = Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY);
  if (daysAgo === 1) return t.time.yesterday;
  const date = new Date(timestamp);
  if (daysAgo < 7) return date.toLocaleDateString(locale, { weekday: 'short' });
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}
