import React from "react";
import { useTranslation } from 'react-i18next';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@repo/ui/components/context-menu";
import { Pencil, Trash2 } from "lucide-react";

export interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
  lastEntryText?: string | null;
  tags?: string[];
}

interface NoteListProps {
  filteredNotes: Note[];
  selectedNote: Note | null;
  handleNoteSelect: (note: Note) => void;
  handleEditNote?: (note: Note) => void;
  handleDeleteNote?: (noteId: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  filteredNotes,
  selectedNote,
  handleNoteSelect,
  handleEditNote,
  handleDeleteNote,
}) => {
  const { t } = useTranslation();
  if (!filteredNotes || filteredNotes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {t('no_notes_found')}
      </div>
    );
  }

  return (
    <div>
      {filteredNotes.map((note) => {
        return (
          <ContextMenu key={note.id}>
            <ContextMenuTrigger asChild>
              <div
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-t first:border-t-0 last:border-b ${
                  selectedNote?.id === note.id
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleNoteSelect(note)}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-primary text-primary font-bold text-lg">
                  {note.title.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base truncate">
                      {note.title}
                    </span>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {note.createdAt instanceof Date
                        ? note.content
                          ? note.createdAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : note.createdAt.toLocaleDateString()
                        : new Date(note.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400 truncate">
                    {note.lastEntryText
                      ? note.lastEntryText.length > 40
                        ? note.lastEntryText.slice(0, 40) + "..."
                        : note.lastEntryText
                      : t('no_note_content_yet')}
                  </span>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem onSelect={() => handleEditNote && handleEditNote(note)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>{t('edit_note_title')}</span>
              </ContextMenuItem>
              <ContextMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                onSelect={() => handleDeleteNote && handleDeleteNote(note.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{t('delete_note')}</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
};