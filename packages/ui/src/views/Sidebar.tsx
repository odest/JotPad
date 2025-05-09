import { Plus, Search, NotebookText, Moon, Sun } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { NoteDialog } from "@repo/ui/components/NoteDialog";
import { useTheme } from "@repo/ui/components/theme-provider";
import { NoteList } from "@repo/ui/components/NoteList";

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
}

interface SidebarProps {
  notes: Note[];
  filteredNotes: Note[];
  selectedNote: Note | null;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleNoteSelect: (note: Note) => void;
  handleEditNote: (note: Note) => void;
  handleDeleteNote: (id: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  noteTitle: string;
  setNoteTitle: (v: string) => void;
  handleCreateNote: () => void;
  showSidebar: boolean;
}

export function Sidebar({
  notes,
  filteredNotes,
  selectedNote,
  searchQuery,
  setSearchQuery,
  handleNoteSelect,
  open,
  setOpen,
  noteTitle,
  setNoteTitle,
  handleCreateNote,
  showSidebar
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const SIDEBAR_HEADER_HEIGHT = 72;
  const SIDEBAR_SEARCH_HEIGHT = 64;
  const SIDEBAR_BUTTON_HEIGHT = 72;
  const NOTES_LIST_HEIGHT = `calc(100vh - ${SIDEBAR_HEADER_HEIGHT + SIDEBAR_SEARCH_HEIGHT + SIDEBAR_BUTTON_HEIGHT}px)`;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`w-full md:w-96 lg:w-[400px] border-r flex flex-col h-[calc(100vh-2.5rem)] border ml-5 mt-5 mb-5 rounded-xl ${
      showSidebar ? 'block' : 'hidden md:block'
    } relative bg-background mr-5 md:mr-0`}>
      <div
        className="border-b bg-transparent z-10 flex items-center justify-between px-4"
        style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}
      >
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="relative h-9 w-9"
        >
          <Moon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Sun className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <div className="relative px-3 py-3 bg-background z-10" style={{ height: SIDEBAR_SEARCH_HEIGHT, minHeight: SIDEBAR_SEARCH_HEIGHT }}>
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search notes..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div style={{ height: NOTES_LIST_HEIGHT }} className="overflow-y-auto custom-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="flex-1 flex flex-col items-center justify-center">
              <NotebookText className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-center">No notes found</h3>
              <p className="text-gray-500 mt-2 text-center">Create a new note to get started</p>
            </div>
          </div>
        ) : (
          <NoteList filteredNotes={filteredNotes} selectedNote={selectedNote} handleNoteSelect={handleNoteSelect} />
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 bg-transparent backdrop-blur-md border-t rounded-b-xl z-20" style={{ height: SIDEBAR_BUTTON_HEIGHT, minHeight: SIDEBAR_BUTTON_HEIGHT }}>
        <NoteDialog
          open={open}
          onOpenChange={setOpen}
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          onCreate={handleCreateNote}
          trigger={
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" /> New Note
            </Button>
          }
        />
      </div>
    </div>
  );
} 