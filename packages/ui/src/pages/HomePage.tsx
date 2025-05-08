import { useState } from "react";
import { Plus, NotebookText } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { NoteCard } from "@repo/ui/components/NoteCard";
import { NoteDialog } from "@repo/ui/components/NoteDialog";

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

  const handleCreateNote = () => {
    if (noteTitle.trim()) {
      if (editId) {
        setNotes(notes => notes.map(note => note.id === editId ? { ...note, title: noteTitle } : note));
        setEditId(null);
      } else {
        const newNote: Note = {
          id: Date.now().toString(),
          title: noteTitle,
          createdAt: new Date(),
        };
        setNotes([newNote, ...notes]);
      }
      setNoteTitle("");
      setOpen(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes => notes.filter(note => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditId(note.id);
    setNoteTitle(note.title);
    setOpen(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="fixed top-0 left-0 right-0 backdrop-blur-md z-10 border-b">
        <div className="w-full py-6 flex flex-col items-center">
          <h1 className="text-4xl font-bold">Notes</h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center pt-32">
        {notes.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center items-center space-y-8 w-full">
            <div className="flex flex-col items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-transparent border-2 border-gray-200 flex items-center justify-center">
                <NotebookText className="w-20 h-20 text-gray-100" />
              </div>
              <div>
                <p className="text-2xl font-semibold">You haven't created any notes yet.</p>
                <p className="text-xl font-semibold italic mt-5 text-center">Start creating now!</p>
              </div>
            </div>
            <NoteDialog
              open={open}
              onOpenChange={setOpen}
              noteTitle={noteTitle}
              setNoteTitle={setNoteTitle}
              onCreate={handleCreateNote}
              trigger={
                <Button size="lg">
                  <Plus className="w-5 h-5" /> Create Note
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 w-full max-w-xl px-4 pb-20">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                title={note.title}
                content={note.content}
                createdAt={note.createdAt}
                onEdit={() => handleEditNote(note)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}
            <NoteDialog
              open={open}
              onOpenChange={setOpen}
              noteTitle={noteTitle}
              setNoteTitle={setNoteTitle}
              onCreate={handleCreateNote}
              trigger={
                <Button
                  size="icon"
                  className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Plus className="h-10 w-10" />
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
} 