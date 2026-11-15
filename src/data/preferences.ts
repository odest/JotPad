import Storage from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

/** How the notes list is ordered. Pinned notes stay on top in every order. */
export type NoteSort = 'activity' | 'newest' | 'oldest' | 'title-asc' | 'title-desc';

const NOTE_SORTS: NoteSort[] = ['activity', 'newest', 'oldest', 'title-asc', 'title-desc'];
const NOTE_SORT_KEY = 'notes.sort';

function readNoteSort(): NoteSort {
  const stored = Storage.getItemSync(NOTE_SORT_KEY);
  return NOTE_SORTS.find((sort) => sort === stored) ?? 'activity';
}

// Read once, synchronously, so the list renders in the saved order on its first frame.
let noteSort = readNoteSort();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useNoteSort(): NoteSort {
  return useSyncExternalStore(subscribe, () => noteSort);
}

export function setNoteSort(sort: NoteSort) {
  Storage.setItemSync(NOTE_SORT_KEY, sort);
  noteSort = sort;
  listeners.forEach((listener) => listener());
}
