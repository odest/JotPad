import { asc, desc, eq } from 'drizzle-orm';
import { useSyncExternalStore } from 'react';

import { TAG_COLORS, type TagColor } from '@/theme/tag-colors';

import { db } from './db';
import * as schema from './schema';

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
  color: TagColor;
};

export type Entry = {
  id: string;
  noteId: string;
  body: string;
  createdAt: number;
  /** When the entry was pinned to the top of its note; null when it is not pinned. */
  pinnedAt: number | null;
};

type State = {
  notes: Note[];
  /** Entries per note id, oldest first. */
  entries: Record<string, Entry[]>;
  tags: Tag[];
};

/**
 * The data lives in SQLite. This module keeps a copy in memory so screens read it
 * synchronously: `loadStore` fills it once at startup, and every action writes to the
 * database first, then updates the copy.
 */
let state: State = { notes: [], entries: {}, tags: [] };
let loaded = false;

/** A stored color, or for tags without one, a color that stays the same for the tag. */
function tagColor(id: string, stored: string | null): TagColor {
  const known = TAG_COLORS.find((color) => color === stored);
  if (known) return known;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return TAG_COLORS[hash % TAG_COLORS.length];
}

function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

/** Reads everything from the database. Call once, after the migrations have run. */
export function loadStore() {
  const noteRows = db.select().from(schema.notes).orderBy(desc(schema.notes.activeAt)).all();
  const entryRows = db.select().from(schema.entries).orderBy(asc(schema.entries.createdAt)).all();
  const tagRows = db.select().from(schema.tags).orderBy(asc(schema.tags.createdAt)).all();
  const links = db.select().from(schema.noteTags).all();

  const entries: Record<string, Entry[]> = {};
  for (const { id, noteId, body, createdAt, pinnedAt } of entryRows) {
    (entries[noteId] ??= []).push({ id, noteId, body, createdAt, pinnedAt });
  }

  loaded = true;
  setState({
    notes: noteRows.map(({ id, title, createdAt, pinned }) => ({
      id,
      title,
      createdAt,
      pinned,
      tagIds: links.filter((link) => link.noteId === id).map((link) => link.tagId),
    })),
    entries,
    tags: tagRows.map(({ id, name, color }) => ({ id, name, color: tagColor(id, color) })),
  });
}

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

/** True once `loadStore` has filled the store from the database. */
export function useStoreLoaded(): boolean {
  return useSyncExternalStore(subscribe, () => loaded);
}

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
    id: newId(),
    title: title.trim(),
    createdAt: Date.now(),
    pinned: false,
    tagIds: [],
  };
  db.insert(schema.notes)
    .values({ ...note, activeAt: note.createdAt })
    .run();
  setState({ ...state, notes: [note, ...state.notes] });
  return note;
}

export function addEntry(noteId: string, body: string): Entry {
  const entry: Entry = {
    id: newId(),
    noteId,
    body: body.trim(),
    createdAt: Date.now(),
    pinnedAt: null,
  };
  db.transaction((tx) => {
    tx.insert(schema.entries).values(entry).run();
    tx.update(schema.notes)
      .set({ activeAt: entry.createdAt })
      .where(eq(schema.notes.id, noteId))
      .run();
  });
  const note = state.notes.find((n) => n.id === noteId);
  setState({
    ...state,
    // The note with the newest entry moves to the top, like a conversation list.
    notes: note ? [note, ...state.notes.filter((n) => n.id !== noteId)] : state.notes,
    entries: { ...state.entries, [noteId]: [...(state.entries[noteId] ?? NO_ENTRIES), entry] },
  });
  return entry;
}

function updateNote(id: string, change: Partial<Pick<Note, 'title' | 'pinned'>>) {
  db.update(schema.notes).set(change).where(eq(schema.notes.id, id)).run();
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
  // Its entries and tag links go with it (ON DELETE CASCADE).
  db.delete(schema.notes).where(eq(schema.notes.id, id)).run();
  const { [id]: _removed, ...entries } = state.entries;
  setState({ ...state, notes: state.notes.filter((note) => note.id !== id), entries });
}

export function setNoteTags(id: string, tagIds: string[]) {
  db.transaction((tx) => {
    tx.delete(schema.noteTags).where(eq(schema.noteTags.noteId, id)).run();
    if (tagIds.length > 0) {
      tx.insert(schema.noteTags)
        .values(tagIds.map((tagId) => ({ noteId: id, tagId })))
        .run();
    }
  });
  setState({
    ...state,
    notes: state.notes.map((note) => (note.id === id ? { ...note, tagIds } : note)),
  });
}

/** The color offered for a new tag: the first one no tag uses yet. */
export function nextTagColor(): TagColor {
  const used = new Set(state.tags.map((tag) => tag.color));
  return (
    TAG_COLORS.find((color) => !used.has(color)) ??
    TAG_COLORS[state.tags.length % TAG_COLORS.length]
  );
}

export function createTag(name: string, color: TagColor): Tag {
  const tag: Tag = { id: newId(), name: name.trim(), color };
  db.insert(schema.tags)
    .values({ ...tag, createdAt: Date.now() })
    .run();
  setState({ ...state, tags: [...state.tags, tag] });
  return tag;
}

/** Changes a tag's name and color. */
export function updateTag(id: string, name: string, color: TagColor) {
  db.update(schema.tags).set({ name: name.trim(), color }).where(eq(schema.tags.id, id)).run();
  setState({
    ...state,
    tags: state.tags.map((tag) => (tag.id === id ? { ...tag, name: name.trim(), color } : tag)),
  });
}

/** Deletes the tag and takes it off every note that had it. */
export function deleteTag(id: string) {
  // Its links to notes go with it (ON DELETE CASCADE).
  db.delete(schema.tags).where(eq(schema.tags.id, id)).run();
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
  db.update(schema.entries).set({ body: body.trim() }).where(eq(schema.entries.id, entry.id)).run();
  const list = state.entries[entry.noteId] ?? NO_ENTRIES;
  setState({
    ...state,
    entries: {
      ...state.entries,
      [entry.noteId]: list.map((e) => (e.id === entry.id ? { ...e, body: body.trim() } : e)),
    },
  });
}

export function setEntryPinned(entry: Entry, pinned: boolean) {
  const pinnedAt = pinned ? Date.now() : null;
  db.update(schema.entries).set({ pinnedAt }).where(eq(schema.entries.id, entry.id)).run();
  const list = state.entries[entry.noteId] ?? NO_ENTRIES;
  setState({
    ...state,
    entries: {
      ...state.entries,
      [entry.noteId]: list.map((e) => (e.id === entry.id ? { ...e, pinnedAt } : e)),
    },
  });
}

export function deleteEntry(entry: Entry) {
  db.delete(schema.entries).where(eq(schema.entries.id, entry.id)).run();
  const list = state.entries[entry.noteId] ?? NO_ENTRIES;
  setState({
    ...state,
    entries: { ...state.entries, [entry.noteId]: list.filter((e) => e.id !== entry.id) },
  });
}
