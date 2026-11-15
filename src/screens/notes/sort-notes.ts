import { type Note } from '@/data/notes-store';
import { type NoteSort } from '@/data/preferences';
import { type Strings } from '@/i18n';

/** The sort menu's options; a function so the labels follow a language change. */
export function sortOptions(t: Strings): { sort: NoteSort; label: string }[] {
  return [
    { sort: 'activity', label: t.notes.sortActivity },
    { sort: 'newest', label: t.notes.sortNewest },
    { sort: 'oldest', label: t.notes.sortOldest },
    { sort: 'title-asc', label: t.notes.sortTitleAsc },
    { sort: 'title-desc', label: t.notes.sortTitleDesc },
  ];
}

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
