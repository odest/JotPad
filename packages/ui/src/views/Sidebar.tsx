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
  lastEntryText?: string;
}

interface SidebarProps {
  filteredNotes: Note[];
  selectedNote: Note | null;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleNoteSelect: (note: Note) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  noteTitle: string;
  setNoteTitle: (v: string) => void;
  handleCreateNote: () => void;
  showSidebar: boolean;
}

export function Sidebar({
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
  const SIDEBAR_FOOTER_HEIGHT = 72;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`w-full md:w-96 lg:w-[400px] md:border-r flex flex-col md:h-[calc(100vh-2.5rem) h-[calc(100vh) md:border md:ml-5 md:mt-5 md:mb-5 rounded-xl ${
      showSidebar ? 'block' : 'hidden md:block'
    } relative bg-background md:mr-0`}>
      <div className="flex flex-col h-full">
        <div className="border-b p-4 shrink-0" style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}>
          <div className="flex items-center justify-between">
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
        </div>
        <div className="border-b p-3.5 shrink-0" style={{ height: SIDEBAR_SEARCH_HEIGHT, minHeight: SIDEBAR_SEARCH_HEIGHT }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
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
        <div className="border-t p-4 shrink-0" style={{ height: SIDEBAR_FOOTER_HEIGHT, minHeight: SIDEBAR_FOOTER_HEIGHT }}>
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
    </div>
  );
} 