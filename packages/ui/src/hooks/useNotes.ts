import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import { useGlobalTags } from "@repo/ui/hooks/useGlobalTags";
import { db, Note as DbNote, TagWithColor } from "@repo/ui/lib/database";

export interface AppNote extends DbNote {
  lastEntryText?: string | null;
  pinned?: boolean;
}

export function useNotes() {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [tags, setTags] = useState<TagWithColor[]>([]);
  const [notes, setNotes] = useState<AppNote[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<AppNote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);
  const [duplicateTitleDialogOpen, setDuplicateTitleDialogOpen] = useState(false);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);

  const { allGlobalTags } = useGlobalTags(notes);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const currentSelectedId = selectedNote?.id;
    if (currentSelectedId && notes.length > 0) {
      const refreshedSelectedNote = notes.find(n => n.id === currentSelectedId);
      if (refreshedSelectedNote) {
        if (
          selectedNote !== refreshedSelectedNote ||
          selectedNote.title !== refreshedSelectedNote.title ||
          selectedNote.content !== refreshedSelectedNote.content ||
          selectedNote.lastEntryText !== refreshedSelectedNote.lastEntryText
        ) {
          setSelectedNote(refreshedSelectedNote);
        }
      } else {
        setSelectedNote(null);
      }
    }
  }, [notes, selectedNote?.id]);

  const loadNotes = async () => {
    try {
      const loadedDbNotes = await db.getNotes();
      const notesWithLastEntry: AppNote[] = await Promise.all(
        loadedDbNotes.map(async (note) => {
          const lastEntryText = await db.getLastEntryText(note.id);
          return { ...note, lastEntryText };
        })
      );
      setNotes(notesWithLastEntry);
    } catch (error) {
      console.error('Failed to load notes:', error);
      await invoke('log_message', { level: 'error', message: `Failed to load notes: ${error}` });
    }
  };

  const handleCreateNote = async () => {
    if (noteTitle.trim()) {
      const duplicate = notes.some(note => note.title.trim().toLowerCase() === noteTitle.trim().toLowerCase());
      if (duplicate && !editId) {
        setDuplicateTitleDialogOpen(true);
        return;
      }
      try {
        if (editId) {
          const currentNoteId = editId;
          await db.updateNote(currentNoteId, noteTitle, undefined, tags);
          await loadNotes();
          await invoke('log_message', { level: 'info', message: `Note edited: ${noteTitle}` });
          setEditId(null);
        } else {
          const newDbNote = await db.createNote(noteTitle, undefined, tags);
          const newAppNote: AppNote = { ...newDbNote, lastEntryText: undefined };
          setNotes(prevNotes => [newAppNote, ...prevNotes]);
          setSelectedNote(newAppNote);
          setShowSidebar(false);
          if (showSettings) setShowSettings(false);
          await invoke('log_message', { level: 'info', message: `New note created: ${noteTitle}` });
        }
        setNoteTitle("");
        setTags([]);
        setOpen(false);
      } catch (error) {
        console.error('Failed to save note:', error);
        await invoke('log_message', { level: 'error', message: `Failed to save note: ${error}` });
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const noteToDelete = notes.find(note => note.id === id);
      await db.deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setShowSidebar(true);
      }
      if (noteToDelete) {
        await invoke('log_message', { level: 'info', message: `Note deleted: ${noteToDelete.title}` });
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      await invoke('log_message', { level: 'error', message: `Failed to delete note: ${error}` });
    }
  };

  const handleOpenEditDialog = (noteToEdit: AppNote) => {
    setEditId(noteToEdit.id);
    setNoteTitle(noteToEdit.title);
    setTags(noteToEdit.tags || []);
    setOpen(true);
    invoke('log_message', { level: 'info', message: `Editing note: ${noteToEdit.title}` });
  };

  const handleNoteSelect = (note: AppNote) => {
    setSelectedNote(note);
    setShowSidebar(false);
    if (showSettings) {
      setShowSettings(false);
    }
  };

  const openSettings = () => {
    setSelectedNote(null);
    setShowSettings(true);
    setShowSidebar(false);
  };

  const closeSettings = () => {
    setShowSettings(false);
    setShowSidebar(true);
  };

  const handleUpdateTag = async (oldName: string, newName: string, newColor: string) => {
    try {
      await db.updateTagColor(oldName, newColor);

      if (oldName.toLowerCase() !== newName.toLowerCase()) {
        const notes = await db.getNotes();
        for (const note of notes) {
          if (note.tags && note.tags.length > 0) {
            const updatedTags = note.tags.map(tag => 
              tag.name.toLowerCase() === oldName.toLowerCase() 
                ? { ...tag, name: newName, color: newColor }
                : tag
            );
            if (JSON.stringify(note.tags) !== JSON.stringify(updatedTags)) {
              await db.updateNote(note.id, note.title, note.content, updatedTags);
            }
          }
        }
      }

      await loadNotes();
      await invoke('log_message', { level: 'info', message: `Tag updated: ${oldName} -> ${newName}` });
    } catch (error) {
      console.error('Failed to update tag:', error);
      await invoke('log_message', { level: 'error', message: `Failed to update tag: ${error}` });
      throw error;
    }
  };

  const handleDeleteTag = async (tagName: string) => {
    try {
      await db.removeTagFromAllNotes(tagName);
      await loadNotes();
      await invoke('log_message', { level: 'info', message: `Tag deleted: ${tagName}` });
    } catch (error) {
      console.error('Failed to delete tag:', error);
      await invoke('log_message', { level: 'error', message: `Failed to delete tag: ${error}` });
      throw error;
    }
  };

  const handleTogglePinNote = async (noteId: string, pinned: boolean) => {
    try {
      await db.togglePinNote(noteId, pinned);
      await loadNotes();
      const note = notes.find(n => n.id === noteId);
      if (note) {
        await invoke('log_message', { 
          level: 'info', 
          message: `Note ${pinned ? 'pinned' : 'unpinned'}: ${note.title}` 
        });
      }
    } catch (error) {
      console.error('Failed to toggle pin note:', error);
      await invoke('log_message', { level: 'error', message: `Failed to toggle pin note: ${error}` });
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SIDEBAR_HEADER_HEIGHT = 72;

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditId(null);
      setNoteTitle("");
      setTags([]);
    }
  };

  return {
    open, setOpen,
    noteTitle, setNoteTitle,
    tags, setTags,
    notes, setNotes,
    editId, setEditId,
    selectedNote, setSelectedNote,
    searchQuery, setSearchQuery,
    showSidebar, setShowSidebar,
    showSettings, setShowSettings,
    noteIdToDelete, setNoteIdToDelete,
    duplicateTitleDialogOpen, setDuplicateTitleDialogOpen,
    tagManagerOpen, setTagManagerOpen,
    allGlobalTags,
    loadNotes,
    handleCreateNote,
    handleDeleteNote,
    handleOpenEditDialog,
    handleNoteSelect,
    handleTogglePinNote,
    openSettings,
    closeSettings,
    handleUpdateTag,
    handleDeleteTag,
    filteredNotes,
    SIDEBAR_HEADER_HEIGHT,
    handleDialogOpenChange,
  };
} 