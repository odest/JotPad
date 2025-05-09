import { useState } from "react";
import { Notebook } from "lucide-react";
import { NoteContent } from "@repo/ui/views/NoteContent";
import { Sidebar } from "@repo/ui/views/Sidebar";

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
}

export function HomePage() {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const handleCreateNote = () => {
    if (noteTitle.trim()) {
      if (editId) {
        setNotes(notes =>
          notes.map(note =>
            note.id === editId ? { ...note, title: noteTitle } : note
          )
        );
        if (selectedNote && selectedNote.id === editId) {
          setSelectedNote({ ...selectedNote, title: noteTitle });
        }
        setEditId(null);
      } else {
        const newNote: Note = {
          id: Date.now().toString(),
          title: noteTitle,
          createdAt: new Date(),
        };
        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);
        setShowSidebar(false);
      }
      setNoteTitle("");
      setOpen(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes => notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setShowSidebar(true);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditId(note.id);
    setNoteTitle(note.title);
    setOpen(true);
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
        notes={notes}
        filteredNotes={filteredNotes}
        selectedNote={selectedNote}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleNoteSelect={handleNoteSelect}
        handleEditNote={handleEditNote}
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