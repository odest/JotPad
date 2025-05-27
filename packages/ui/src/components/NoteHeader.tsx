import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@repo/ui/components/dropdown-menu";
import { ChevronLeft, MoreVertical, Pencil, Trash, Search } from "lucide-react";
import { Note } from "@repo/ui/lib/database";

interface NoteHeaderProps {
  selectedNote: Note;
  handleEditNote: (note: Note) => void;
  handleDeleteNote: (id: string) => void;
  setShowSidebar: (v: boolean) => void;
  isSearchActive: boolean;
  setIsSearchActive: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  SIDEBAR_HEADER_HEIGHT: number;
}

export function NoteHeader({
  selectedNote,
  handleEditNote,
  handleDeleteNote,
  setShowSidebar,
  isSearchActive,
  setIsSearchActive,
  searchQuery,
  setSearchQuery,
  SIDEBAR_HEADER_HEIGHT
}: NoteHeaderProps) {
  const toggleHeaderSearchIcon = () => {
    if (isSearchActive) {
      setSearchQuery("");
    }
    setIsSearchActive(!isSearchActive);
  };

  return (
    <div 
      className="border-b p-4 shrink-0 z-10 bg-background" 
      style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowSidebar(true)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-primary text-primary font-bold text-lg shrink-0">
              {selectedNote.title.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold truncate">{selectedNote.title}</h2>
              <div className="flex items-center text-xs italic text-muted-foreground">
                Created: {new Date(selectedNote.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={toggleHeaderSearchIcon} className="shrink-0">
              <Search className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleEditNote(selectedNote)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Edit Title</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  <span>Delete Note</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}