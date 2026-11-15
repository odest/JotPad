/** Where a row sits in its group, which decides which of its corners are rounded. */
export type GroupPosition = 'only' | 'first' | 'middle' | 'last';

export function groupPosition(index: number, length: number): GroupPosition {
  if (length === 1) return 'only';
  if (index === 0) return 'first';
  if (index === length - 1) return 'last';
  return 'middle';
}
