import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: integer('created_at').notNull(),
  /** Time of the last new entry, or of creation. The note list is ordered by it. */
  activeAt: integer('active_at').notNull(),
  pinned: integer('pinned', { mode: 'boolean' }).notNull().default(false),
});

export const entries = sqliteTable(
  'entries',
  {
    id: text('id').primaryKey(),
    noteId: text('note_id')
      .notNull()
      .references(() => notes.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    createdAt: integer('created_at').notNull(),
    /** When the entry was pinned to the top of its note; null when it is not pinned. */
    pinnedAt: integer('pinned_at'),
  },
  (table) => [index('entries_note_id_idx').on(table.noteId, table.createdAt)],
);

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const noteTags = sqliteTable(
  'note_tags',
  {
    noteId: text('note_id')
      .notNull()
      .references(() => notes.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.noteId, table.tagId] })],
);
