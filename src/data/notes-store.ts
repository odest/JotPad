import { useSyncExternalStore } from 'react';

export type Note = {
  id: string;
  title: string;
  createdAt: number;
  pinned: boolean;
  tagIds: string[];
};

export type Tag = {
  id: string;
  name: string;
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
  tags: Tag[];
};

/**
 * In-memory store. It holds the data for the lifetime of the process only; the
 * persistence layer replaces this module while keeping the same hooks and actions.
 */
let state: State = { notes: [], entries: {}, tags: [] };
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

export function useTags(): Tag[] {
  return useStore((s) => s.tags);
}

export function useTag(id: string): Tag | undefined {
  return useStore((s) => s.tags.find((tag) => tag.id === id));
}

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
  const note: Note = {
    id: String(nextId++),
    title: title.trim(),
    createdAt: Date.now(),
    pinned: false,
    tagIds: [],
  };
  setState({ ...state, notes: [note, ...state.notes] });
  return note;
}

export function addEntry(noteId: string, body: string): Entry {
  const entry: Entry = { id: String(nextId++), noteId, body: body.trim(), createdAt: Date.now() };
  const note = state.notes.find((n) => n.id === noteId);
  setState({
    ...state,
    // The note with the newest entry moves to the top, like a conversation list.
    notes: note ? [note, ...state.notes.filter((n) => n.id !== noteId)] : state.notes,
    entries: { ...state.entries, [noteId]: [...(state.entries[noteId] ?? NO_ENTRIES), entry] },
  });
  return entry;
}

function updateNote(id: string, change: Partial<Note>) {
  setState({
    ...state,
    notes: state.notes.map((note) => (note.id === id ? { ...note, ...change } : note)),
  });
}

export function renameNote(id: string, title: string) {
  updateNote(id, { title: title.trim() });
}

export function setNotePinned(id: string, pinned: boolean) {
  updateNote(id, { pinned });
}

export function deleteNote(id: string) {
  const { [id]: _removed, ...entries } = state.entries;
  setState({ ...state, notes: state.notes.filter((note) => note.id !== id), entries });
}

export function setNoteTags(id: string, tagIds: string[]) {
  updateNote(id, { tagIds });
}

export function createTag(name: string): Tag {
  const tag: Tag = { id: String(nextId++), name: name.trim() };
  setState({ ...state, tags: [...state.tags, tag] });
  return tag;
}

export function renameTag(id: string, name: string) {
  setState({
    ...state,
    tags: state.tags.map((tag) => (tag.id === id ? { ...tag, name: name.trim() } : tag)),
  });
}

/** Deletes the tag and takes it off every note that had it. */
export function deleteTag(id: string) {
  setState({
    ...state,
    tags: state.tags.filter((tag) => tag.id !== id),
    notes: state.notes.map((note) =>
      note.tagIds.includes(id)
        ? { ...note, tagIds: note.tagIds.filter((tagId) => tagId !== id) }
        : note,
    ),
  });
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
