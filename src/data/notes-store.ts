import { useSyncExternalStore } from 'react';

export type Note = {
  id: string;
  title: string;
  createdAt: number;
};

export type Entry = {
  id: string;
  noteId: string;
  body: string;
  createdAt: number;
};

type State = {
  notes: Note[];
  /** Entries per note id, oldest first. */
  entries: Record<string, Entry[]>;
};

/**
 * In-memory store. It holds the data for the lifetime of the process only; the
 * persistence layer replaces this module while keeping the same hooks and actions.
 */
let state: State = { notes: [], entries: {} };
let nextId = 1;

const listeners = new Set<() => void>();

function setState(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function useStore<T>(selector: (state: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state));
}

const NO_ENTRIES: Entry[] = [];

export function useNotes(): Note[] {
  return useStore((s) => s.notes);
}

export function useNote(id: string): Note | undefined {
  return useStore((s) => s.notes.find((note) => note.id === id));
}

export function useEntries(noteId: string): Entry[] {
  return useStore((s) => s.entries[noteId] ?? NO_ENTRIES);
}

/** Every entry, keyed by note id. */
export function useAllEntries(): Record<string, Entry[]> {
  return useStore((s) => s.entries);
}

export function useLastEntry(noteId: string): Entry | undefined {
  return useStore((s) => s.entries[noteId]?.at(-1));
}

export function createNote(title: string): Note {
  const note: Note = { id: String(nextId++), title: title.trim(), createdAt: Date.now() };
  setState({ ...state, notes: [note, ...state.notes] });
  return note;
}

export function addEntry(noteId: string, body: string): Entry {
  const entry: Entry = { id: String(nextId++), noteId, body: body.trim(), createdAt: Date.now() };
  const note = state.notes.find((n) => n.id === noteId);
  setState({
    // The note with the newest entry moves to the top, like a conversation list.
    notes: note ? [note, ...state.notes.filter((n) => n.id !== noteId)] : state.notes,
    entries: { ...state.entries, [noteId]: [...(state.entries[noteId] ?? NO_ENTRIES), entry] },
  });
  return entry;
}

export function updateEntry(entry: Entry, body: string) {
  const list = state.entries[entry.noteId] ?? NO_ENTRIES;
  setState({
    ...state,
    entries: {
      ...state.entries,
      [entry.noteId]: list.map((e) => (e.id === entry.id ? { ...e, body: body.trim() } : e)),
    },
  });
}

export function deleteEntry(entry: Entry) {
  const list = state.entries[entry.noteId] ?? NO_ENTRIES;
  setState({
    ...state,
    entries: { ...state.entries, [entry.noteId]: list.filter((e) => e.id !== entry.id) },
  });
}
