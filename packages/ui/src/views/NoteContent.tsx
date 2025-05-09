import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from "@repo/ui/components/dropdown-menu";
import { ChevronLeft, MoreVertical, Pencil, Trash } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
}

interface NoteContentProps {
  selectedNote: Note;
  handleEditNote: (note: Note) => void;
  handleDeleteNote: (id: string) => void;
  setShowSidebar: (v: boolean) => void;
  SIDEBAR_HEADER_HEIGHT: number;
}

export function NoteContent({
  selectedNote,
  handleEditNote,
  handleDeleteNote,
  setShowSidebar,
  SIDEBAR_HEADER_HEIGHT
}: NoteContentProps) {
  return (
    <>
      <div className="border-b p-4" style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowSidebar(true)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black dark:border-white font-bold text-lg">
                {selectedNote.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold">{selectedNote.title}</h2>
                <div className="flex items-center text-xs italic text-gray-500">
                  {new Date(selectedNote.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleEditNote(selectedNote)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
        <div className="max-w-3xl mx-auto w-full">
          <div className="prose max-w-none text-center">
            {selectedNote.content || "No note content yet..."}
          </div>
        </div>
      </div>
    </>
  );
} 