import { v4 as uuidv4 } from 'uuid';
import Database from '@tauri-apps/plugin-sql';

export interface TagWithColor {
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
  tags?: TagWithColor[];
  pinned?: boolean;
}

export interface NoteEntry {
  id: string;
  note_id: string;
  text: string;
  timestamp: string;
  pinned?: boolean;
}

class DatabaseService {
  private db: Database | null = null;

  async initialize() {
    if (!this.db) {
      this.db = await Database.load('sqlite:notes.db');
    }
    return this.db;
  }

  async execute(query: string, params: any[] = []): Promise<void> {
    const db = await this.initialize();
    await db.execute(query, params);
  }

  async getNotes(): Promise<Note[]> {
    const db = await this.initialize();
    const result = await db.select<any[]>('SELECT * FROM notes ORDER BY pinned DESC, created_at DESC');
    return result.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
      pinned: Boolean(note.pinned),
    }));
  }

  async createNote(title: string, content?: string, tags: TagWithColor[] = []): Promise<Note> {
    const db = await this.initialize();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await db.execute(
      'INSERT INTO notes (id, title, content, created_at, updated_at, tags, pinned) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, content || null, now, now, JSON.stringify(tags), 0]
    );

    return {
      id,
      title,
      content,
      created_at: now,
      updated_at: now,
      tags,
      pinned: false,
    };
  }

  async updateNote(id: string, title: string, content?: string, tags: TagWithColor[] = []): Promise<void> {
    const db = await this.initialize();
    const now = new Date().toISOString();
    
    await db.execute(
      'UPDATE notes SET title = ?, content = ?, updated_at = ?, tags = ? WHERE id = ?',
      [title, content || null, now, JSON.stringify(tags), id]
    );
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.initialize();
    await db.execute('DELETE FROM notes WHERE id = ?', [id]);
  }

  async getNoteEntries(noteId: string): Promise<NoteEntry[]> {
    const db = await this.initialize();
    const result = await db.select<any[]>(
      'SELECT * FROM note_entries WHERE note_id = ? ORDER BY timestamp ASC',
      [noteId]
    );
    return result.map(entry => ({
      ...entry,
      pinned: Boolean(entry.pinned),
    }));
  }

  async getPinnedEntries(noteId: string): Promise<NoteEntry[]> {
    const db = await this.initialize();
    const result = await db.select<any[]>(
      'SELECT * FROM note_entries WHERE note_id = ? AND pinned = 1 ORDER BY timestamp ASC',
      [noteId]
    );
    return result.map(entry => ({
      ...entry,
      pinned: Boolean(entry.pinned),
    }));
  }

  async addNoteEntry(noteId: string, text: string): Promise<NoteEntry> {
    const db = await this.initialize();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await db.execute(
      'INSERT INTO note_entries (id, note_id, text, timestamp, pinned) VALUES (?, ?, ?, ?, ?)',
      [id, noteId, text, now, 0]
    );

    return {
      id,
      note_id: noteId,
      text,
      timestamp: now,
      pinned: false,
    };
  }

  async deleteNoteEntry(id: string): Promise<void> {
    const db = await this.initialize();
    await db.execute('DELETE FROM note_entries WHERE id = ?', [id]);
  }

  async getLastEntryText(noteId: string): Promise<string | null> {
    const db = await this.initialize();
    const result = await db.select<NoteEntry[]>(
      'SELECT text FROM note_entries WHERE note_id = ? ORDER BY timestamp DESC LIMIT 1',
      [noteId]
    );
    return result[0]?.text ?? null;
  }

  async addNoteEntryAndUpdateContent(noteId: string, text: string): Promise<NoteEntry> {
    const entry = await this.addNoteEntry(noteId, text);
    await this.updateNoteContent(noteId, text);
    return entry;
  }

  async updateNoteContent(noteId: string, content: string): Promise<void> {
    const db = await this.initialize();
    const now = new Date().toISOString();
    await db.execute(
      'UPDATE notes SET content = ?, updated_at = ? WHERE id = ?',
      [content, now, noteId]
    );
  }

  async updateTagColor(tagName: string, newColor: string): Promise<void> {
    const db = await this.initialize();
    const notes = await this.getNotes();

    for (const note of notes) {
      if (note.tags && note.tags.length > 0) {
        const updatedTags = note.tags.map(tag => 
          tag.name.toLowerCase() === tagName.toLowerCase() 
            ? { ...tag, color: newColor }
            : tag
        );
        if (JSON.stringify(note.tags) !== JSON.stringify(updatedTags)) {
          await db.execute(
            'UPDATE notes SET tags = ?, updated_at = ? WHERE id = ?',
            [JSON.stringify(updatedTags), new Date().toISOString(), note.id]
          );
        }
      }
    }
  }

  async removeTagFromAllNotes(tagName: string): Promise<void> {
    const db = await this.initialize();
    const notes = await this.getNotes();

    for (const note of notes) {
      if (note.tags && note.tags.length > 0) {
        const updatedTags = note.tags.filter(tag => 
          tag.name.toLowerCase() !== tagName.toLowerCase()
        );
        if (updatedTags.length !== note.tags.length) {
          await db.execute(
            'UPDATE notes SET tags = ?, updated_at = ? WHERE id = ?',
            [JSON.stringify(updatedTags), new Date().toISOString(), note.id]
          );
        }
      }
    }
  }

  async togglePinNote(id: string, pinned: boolean): Promise<void> {
    const db = await this.initialize();
    const now = new Date().toISOString();
    
    await db.execute(
      'UPDATE notes SET pinned = ?, updated_at = ? WHERE id = ?',
      [pinned ? 1 : 0, now, id]
    );
  }

  async togglePinEntry(entryId: string, pinned: boolean): Promise<void> {
    const db = await this.initialize();
    await db.execute(
      'UPDATE note_entries SET pinned = ? WHERE id = ?',
      [pinned ? 1 : 0, entryId]
    );
  }
}

export const db = new DatabaseService(); 