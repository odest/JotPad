import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import { db, Note, NoteEntry } from "@repo/ui/lib/database";

export function useNoteEntries(selectedNote: Note | null, onEntryAdded?: () => void) {
  const [noteEntries, setNoteEntries] = useState<NoteEntry[]>([]);

  useEffect(() => {
    if (selectedNote) {
      loadNoteEntries();
    }
  }, [selectedNote?.id]);

  const loadNoteEntries = async () => {
    if (!selectedNote) return;
    try {
      const entries = await db.getNoteEntries(selectedNote.id);
      setNoteEntries(entries);
    } catch (error) {
      console.error('Failed to load note entries:', error);
      await invoke('log_message', { level: 'error', message: `Failed to load note entries: ${error}` });
    }
  };

  const addEntry = async (text: string): Promise<boolean> => {
    if (!selectedNote) return false;
    try {
      const newEntry = await db.addNoteEntry(selectedNote.id, text);
      const preview = text.length > 40 ? text.slice(0, 40) + "..." : text;
      await db.updateNoteContent(selectedNote.id, preview);
      setNoteEntries(prevEntries => [...prevEntries, newEntry]);
      await invoke('log_message', { level: 'info', message: `Added new entry to note: ${selectedNote.title}` });
      if (typeof onEntryAdded === 'function') onEntryAdded();
      return true;
    } catch (error) {
      console.error('Failed to add note entry:', error);
      await invoke('log_message', { level: 'error', message: `Failed to add note entry: ${error}` });
      return false;
    }
  };

  const editEntry = async (entryId: string, newText: string): Promise<boolean> => {
    if (!selectedNote) return false;
    try {
      await db.execute(
        'UPDATE note_entries SET text = ? WHERE id = ?',
        [newText, entryId]
      );
      setNoteEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === entryId ? { ...entry, text: newText } : entry
        )
      );
      await invoke('log_message', { level: 'info', message: `Entry edited in note: ${selectedNote.title}` });
      const isLastEntry = noteEntries[noteEntries.length - 1]?.id === entryId;
      if (isLastEntry && typeof onEntryAdded === 'function') onEntryAdded();
      return true;
    } catch (error) {
      console.error('Failed to edit entry:', error);
      await invoke('log_message', { level: 'error', message: `Failed to edit entry: ${error}` });
      return false;
    }
  };

  const deleteEntry = async (entryId: string): Promise<boolean> => {
    if (!selectedNote) return false;
    try {
      await db.deleteNoteEntry(entryId);
      setNoteEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
      await invoke('log_message', { level: 'info', message: `Entry deleted from note: ${selectedNote.title}` });
      const isLastEntry = noteEntries[noteEntries.length - 1]?.id === entryId;
      if (isLastEntry && typeof onEntryAdded === 'function') onEntryAdded();
      return true;
    } catch (error) {
      console.error('Failed to delete entry:', error);
      await invoke('log_message', { level: 'error', message: `Failed to delete entry: ${error}` });
      return false;
    }
  };

  return {
    noteEntries,
    setNoteEntries,
    loadNoteEntries,
    addEntry,
    editEntry,
    deleteEntry
  };
}