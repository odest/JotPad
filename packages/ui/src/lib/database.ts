import Database from '@tauri-apps/plugin-sql';

export interface Note {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
}

export interface NoteEntry {
  id: string;
  note_id: string;
  text: string;
  timestamp: string;
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
    const result = await db.select<Note[]>('SELECT * FROM notes ORDER BY created_at DESC');
    return result;
  }

  async createNote(title: string, content?: string): Promise<Note> {
    const db = await this.initialize();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await db.execute(
      'INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [id, title, content || null, now, now]
    );

    return {
      id,
      title,
      content,
      created_at: now,
      updated_at: now
    };
  }

  async updateNote(id: string, title: string, content?: string): Promise<void> {
    const db = await this.initialize();
    const now = new Date().toISOString();
    
    await db.execute(
      'UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?',
      [title, content || null, now, id]
    );
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.initialize();
    await db.execute('DELETE FROM notes WHERE id = ?', [id]);
  }

  async getNoteEntries(noteId: string): Promise<NoteEntry[]> {
    const db = await this.initialize();
    const result = await db.select<NoteEntry[]>(
      'SELECT * FROM note_entries WHERE note_id = ? ORDER BY timestamp ASC',
      [noteId]
    );
    return result;
  }

  async addNoteEntry(noteId: string, text: string): Promise<NoteEntry> {
    const db = await this.initialize();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await db.execute(
      'INSERT INTO note_entries (id, note_id, text, timestamp) VALUES (?, ?, ?, ?)',
      [id, noteId, text, now]
    );

    return {
      id,
      note_id: noteId,
      text,
      timestamp: now
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
}

export const db = new DatabaseService(); 