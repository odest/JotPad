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
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/** Day heading for a conversation: "Today", "Yesterday", a weekday, or a full date. */
export function formatDay(timestamp: number, now = Date.now()): string {
  const daysAgo = Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY);
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  const date = new Date(timestamp);
  if (daysAgo < 7) return date.toLocaleDateString(undefined, { weekday: 'long' });
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Compact stamp for list rows: the time today, otherwise the day. */
export function formatListStamp(timestamp: number, now = Date.now()): string {
  if (isSameDay(timestamp, now)) return formatTime(timestamp);
  const daysAgo = Math.round((startOfDay(now) - startOfDay(timestamp)) / DAY);
  if (daysAgo === 1) return 'Yesterday';
  const date = new Date(timestamp);
  if (daysAgo < 7) return date.toLocaleDateString(undefined, { weekday: 'short' });
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
