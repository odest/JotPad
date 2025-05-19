import { useState, useEffect } from "react";
import { NoteContent } from "@repo/ui/views/NoteContent";
import { Sidebar } from "@repo/ui/views/Sidebar";
import { invoke } from '@tauri-apps/api/core';
import { db, Note as DbNote } from "@repo/ui/lib/database";

interface AppNote extends DbNote {
  lastEntryText?: string | null;
}

export function HomePage() {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [notes, setNotes] = useState<AppNote[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<AppNote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const currentSelectedId = selectedNote?.id;
    if (currentSelectedId && notes.length > 0) {
      const refreshedSelectedNote = notes.find(n => n.id === currentSelectedId);
      if (refreshedSelectedNote) {
        if (selectedNote !== refreshedSelectedNote ||
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
      try {
        if (editId) {
          const currentNoteId = editId;
          await db.updateNote(currentNoteId, noteTitle);
          await loadNotes();
          await invoke('log_message', { level: 'info', message: `Note edited: ${noteTitle}` });
          setEditId(null);
        } else {
          const newDbNote = await db.createNote(noteTitle);
          const newAppNote: AppNote = { ...newDbNote, lastEntryText: undefined };
          setNotes(prevNotes => [newAppNote, ...prevNotes]);
          setSelectedNote(newAppNote);
          setShowSidebar(false);
          await invoke('log_message', { level: 'info', message: `New note created: ${noteTitle}` });
        }
        setNoteTitle("");
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
    setOpen(true);
    invoke('log_message', { level: 'info', message: `Editing note: ${noteToEdit.title}` });
  };

  const handleNoteSelect = (note: AppNote) => {
    setSelectedNote(note);
    setShowSidebar(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SIDEBAR_HEADER_HEIGHT = 72;

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar
        filteredNotes={filteredNotes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: new Date(note.created_at),
          lastEntryText: note.lastEntryText,
        }))}
        selectedNote={selectedNote ? {
          id: selectedNote.id,
          title: selectedNote.title,
          content: selectedNote.content,
          createdAt: new Date(selectedNote.created_at),
          lastEntryText: selectedNote.lastEntryText,
        } : null}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleNoteSelect={(noteFromList) => {
          const originalNote = notes.find(n => n.id === noteFromList.id);
          if (originalNote) {
            handleNoteSelect(originalNote);
          }
        }}
        open={open}
        setOpen={setOpen}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        handleCreateNote={handleCreateNote}
        showSidebar={showSidebar}
        handleEditNote={(noteFromList) => {
          const originalNote = notes.find(n => n.id === noteFromList.id);
          if (originalNote) {
            handleOpenEditDialog(originalNote);
          }
        }}
        handleDeleteNote={handleDeleteNote}
      />
      <NoteContent
        selectedNote={selectedNote}
        handleEditNote={handleOpenEditDialog}
        handleDeleteNote={handleDeleteNote}
        setShowSidebar={setShowSidebar}
        SIDEBAR_HEADER_HEIGHT={SIDEBAR_HEADER_HEIGHT}
        onEntryAdded={loadNotes}
        showSidebar={showSidebar}
      />
    </div>
  );
}