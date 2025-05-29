import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@repo/ui/components/dropdown-menu";
import {
  X,
  Sun,
  Moon,
  Plus,
  Clock,
  Check,
  Search,
  Settings,
  ArrowUpAZ,
  ArrowDownAZ,
  ArrowDownUp,
  NotebookText,
} from "lucide-react";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { NoteDialog } from "@repo/ui/components/note/NoteDialog";
import { useTheme } from "@repo/ui/providers/theme-provider";
import { NoteList, Note as NoteListNote } from "@repo/ui/components/note/NoteList";
import { useSettings } from "@repo/ui/hooks/useSettings";

interface SidebarProps {
  filteredNotes: NoteListNote[];
  selectedNote: NoteListNote | null;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleNoteSelect: (note: NoteListNote) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  noteTitle: string;
  setNoteTitle: (v: string) => void;
  handleCreateNote: () => void;
  showSidebar: boolean;
  handleEditNote?: (note: NoteListNote) => void;
  handleDeleteNote?: (noteId: string) => void;
  onToggleSettings: () => void;
  isEdit: boolean;
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
  showSidebar,
  handleEditNote,
  handleDeleteNote,
  onToggleSettings,
  isEdit,
}: SidebarProps) {
  const { appliedTheme } = useTheme();
  const { setThemeAndPersist, sortType, setSortType } = useSettings();
  const SIDEBAR_HEADER_HEIGHT = 72;
  const SIDEBAR_SEARCH_HEIGHT = 64;
  const SIDEBAR_FOOTER_HEIGHT = 72;

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortType === 'az') {
      return a.title.localeCompare(b.title);
    } else if (sortType === 'za') {
      return b.title.localeCompare(a.title);
    } else if (sortType === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortType === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  const sortLabels = {
    az: 'A-Z',
    za: 'Z-A',
    newest: 'Newest',
    oldest: 'Oldest',
  };

  const toggleThemeInSidebar = () => {
    setThemeAndPersist(appliedTheme === "light" ? "dark" : "light");
  };

  return (
    <div className={`w-full md:w-96 lg:w-[400px] md:border-r flex flex-col md:h-[calc(100vh-2.5rem)] h-[calc(100vh)] md:border md:ml-5 md:mt-5 md:mb-5 rounded-xl ${
      showSidebar ? 'block' : 'hidden md:block'
    } relative bg-background md:mr-0`}>
      <div className="flex flex-col h-full">
        <div className="border-b p-4 shrink-0" style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notes</h1>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleThemeInSidebar}
                className="relative h-9 w-9"
                aria-label="Toggle theme"
              >
                <Moon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Sun className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSettings}
                className="h-9 w-9"
                aria-label="Open settings"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-b p-3.5 shrink-0" style={{ height: SIDEBAR_SEARCH_HEIGHT, minHeight: SIDEBAR_SEARCH_HEIGHT }}>
          <div className="relative flex items-center gap-2">
            <span className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notes..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:bg-transparent focus:bg-transparent"
                  onClick={() => setSearchQuery("")}
                  tabIndex={-1}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon" className="ml-1 border" aria-label="Filtrele">
                  <ArrowDownUp className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setSortType('az')} className={sortType === 'az' ? 'bg-accent' : ''}>
                  <ArrowDownAZ className="w-4 h-4 mr-2" />{sortLabels.az}
                  {sortType === 'az' && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortType('za')} className={sortType === 'za' ? 'bg-accent' : ''}>
                  <ArrowUpAZ className="w-4 h-4 mr-2" />{sortLabels.za}
                  {sortType === 'za' && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortType('newest')} className={sortType === 'newest' ? 'bg-accent' : ''}>
                  <Clock className="w-4 h-4 mr-2" />{sortLabels.newest}
                  {sortType === 'newest' && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortType('oldest')} className={sortType === 'oldest' ? 'bg-accent' : ''}>
                  <Clock className="w-4 h-4 mr-2 rotate-180" />{sortLabels.oldest}
                  {sortType === 'oldest' && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sortedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="flex-1 flex flex-col items-center justify-center">
                <NotebookText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-center">No notes found</h3>
                <p className="text-gray-500 mt-2 text-center">Create a new note to get started</p>
              </div>
            </div>
          ) : (
            <NoteList
              filteredNotes={sortedNotes}
              selectedNote={selectedNote}
              handleNoteSelect={handleNoteSelect}
              handleEditNote={handleEditNote}
              handleDeleteNote={handleDeleteNote}
            />
          )}
        </div>
        <div className="border-t p-4 shrink-0" style={{ height: SIDEBAR_FOOTER_HEIGHT, minHeight: SIDEBAR_FOOTER_HEIGHT }}>
          <NoteDialog
            open={open}
            onOpenChange={setOpen}
            noteTitle={noteTitle}
            setNoteTitle={setNoteTitle}
            onCreate={handleCreateNote}
            isEdit={isEdit}
            trigger={
              <Button className="w-full" onClick={() => {
                setNoteTitle("");
                setOpen(true);
              }}>
                <Plus className="w-4 h-4 mr-2" /> New Note
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}