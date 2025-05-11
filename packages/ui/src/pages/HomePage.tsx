import { useState, useEffect } from "react";
import { Notebook } from "lucide-react";
import { NoteContent } from "@repo/ui/views/NoteContent";
import { Sidebar } from "@repo/ui/views/Sidebar";
import { invoke } from '@tauri-apps/api/core';
import { db, Note } from "@repo/ui/lib/database";

export function HomePage() {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const loadedNotes = await db.getNotes();
      const notesWithLastEntry = await Promise.all(
        loadedNotes.map(async (note) => {
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
          await db.updateNote(editId, noteTitle);
          await loadNotes();
          if (selectedNote && selectedNote.id === editId) {
            setSelectedNote({ ...selectedNote, title: noteTitle });
          }
          await invoke('log_message', { level: 'info', message: `Note edited: ${noteTitle}` });
          setEditId(null);
        } else {
          const newNote = await db.createNote(noteTitle);
          setNotes([newNote, ...notes]);
          setSelectedNote(newNote);
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
      await loadNotes();
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

  const handleEditNote = (note: Note) => {
    setEditId(note.id);
    setNoteTitle(note.title);
    setOpen(true);
    invoke('log_message', { level: 'info', message: `Editing note: ${note.title}` });
  };

  const handleNoteSelect = (note: Note) => {
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
        notes={notes.map(note => ({
          ...note,
          createdAt: new Date(note.created_at)
        }))}
        filteredNotes={filteredNotes.map(note => ({
          ...note, 
          createdAt: new Date(note.created_at)
        }))}
        selectedNote={selectedNote ? {
          ...selectedNote,
          createdAt: new Date(selectedNote.created_at)
        } : null}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleNoteSelect={(note) => handleNoteSelect({
          ...note,
          created_at: note.createdAt.toISOString(),
          updated_at: note.createdAt.toISOString()
        })}
        handleEditNote={(note) => handleEditNote({
          ...note,
          created_at: note.createdAt.toISOString(),
          updated_at: note.createdAt.toISOString()
        })}
        handleDeleteNote={handleDeleteNote}
        open={open}
        setOpen={setOpen}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        handleCreateNote={handleCreateNote}
        showSidebar={showSidebar}
      />
      <div className={`flex-1 flex flex-col h-[calc(100vh-2.5rem)] border m-5 rounded-xl ${!showSidebar ? 'block' : 'hidden md:block'} bg-background`}>
        {selectedNote ? (
          <NoteContent
            selectedNote={selectedNote}
            handleEditNote={handleEditNote}
            handleDeleteNote={handleDeleteNote}
            setShowSidebar={setShowSidebar}
            SIDEBAR_HEADER_HEIGHT={SIDEBAR_HEADER_HEIGHT}
            onEntryAdded={loadNotes}
          />
        ) : (
          <div className="flex-1 flex justify-center items-center h-[calc(100vh-2.5rem)]">
            <div className="flex flex-col items-center justify-center">
              <Notebook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-center">Select a note</h3>
              <p className="text-gray-500 mt-2 text-center">Choose a note from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}