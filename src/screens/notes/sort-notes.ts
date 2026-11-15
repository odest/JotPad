import { type Note } from '@/data/notes-store';
import { type NoteSort } from '@/data/preferences';

export const SORT_OPTIONS: { sort: NoteSort; label: string }[] = [
  { sort: 'activity', label: 'Recent activity' },
  { sort: 'newest', label: 'Newest first' },
  { sort: 'oldest', label: 'Oldest first' },
  { sort: 'title-asc', label: 'Title A–Z' },
  { sort: 'title-desc', label: 'Title Z–A' },
];

const byTitle = (a: Note, b: Note) =>
  a.title.localeCompare(b.title, undefined, { sensitivity: 'base', numeric: true });

/**
 * Orders the notes for the list. The store already holds them by recent activity, so
 * that order needs no sort. Pinned notes come first whatever the order.
 */
export function sortNotes(notes: Note[], sort: NoteSort): Note[] {
  const sorted = [...notes];
  if (sort === 'newest') sorted.sort((a, b) => b.createdAt - a.createdAt);
  if (sort === 'oldest') sorted.sort((a, b) => a.createdAt - b.createdAt);
  if (sort === 'title-asc') sorted.sort(byTitle);
  if (sort === 'title-desc') sorted.sort((a, b) => byTitle(b, a));
  return [...sorted.filter((note) => note.pinned), ...sorted.filter((note) => !note.pinned)];
}
