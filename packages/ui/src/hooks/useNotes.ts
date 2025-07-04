import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import { db, Note as DbNote } from "@repo/ui/lib/database";

export interface AppNote extends DbNote {
  lastEntryText?: string | null;
}

export function useNotes() {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState<AppNote[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<AppNote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);
  const [duplicateTitleDialogOpen, setDuplicateTitleDialogOpen] = useState(false);

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
    loadNotes,
    handleCreateNote,
    handleDeleteNote,
    handleOpenEditDialog,
    handleNoteSelect,
    openSettings,
    closeSettings,
    filteredNotes,
    SIDEBAR_HEADER_HEIGHT,
    handleDialogOpenChange,
  };
} 