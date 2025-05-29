import { useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@repo/ui/components/dropdown-menu";
import {
  Trash,
  Search,
  Pencil,
  Download,
  ChevronLeft,
  MoreVertical,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Note } from "@repo/ui/lib/database";
import { exportSingleNote } from "@repo/ui/lib/exportNotes";
import { ExportNoteDialog, ExportFormat } from "@repo/ui/components/note/ExportNoteDialog";

interface NoteHeaderProps {
  selectedNote: Note;
  handleEditNote: (note: Note) => void;
  handleDeleteNote: (id: string) => void;
  setShowSidebar: (v: boolean) => void;
  isSearchActive: boolean;
  setIsSearchActive: (v: boolean) => void;
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
  setSearchQuery,
  SIDEBAR_HEADER_HEIGHT
}: NoteHeaderProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const toggleHeaderSearchIcon = () => {
    if (isSearchActive) {
      setSearchQuery("");
    }
    setIsSearchActive(!isSearchActive);
  };

  const handleOpenExportDialog = () => {
    setIsExportDialogOpen(true);
  };

  const handleConfirmNoteExport = (format: ExportFormat, note: Note) => {
    invoke('log_message', { level: 'info', message: `Attempting to export notes. Format: ${format}`});
    try {
      exportSingleNote(note, format);
      invoke('log_message', { level: 'info', message: `Notes successfully exported. Format: ${format}`});
    } catch (error) {
      invoke('log_message', { level: 'error', message: `Export failed for notes with format ${format}:`, error});
      alert("Export failed. Please try again.");
    }
  };

  return (
    <>
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
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleEditNote(selectedNote)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    <span>Edit Title</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleOpenExportDialog}>
                    <Download className="w-4 h-4 mr-2" />
                    <span>Export Note</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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

      {selectedNote && (
        <ExportNoteDialog
          isOpen={isExportDialogOpen}
          onOpenChange={setIsExportDialogOpen}
          note={selectedNote}
          onConfirmExport={handleConfirmNoteExport}
        />
      )}
    </>
  );
}