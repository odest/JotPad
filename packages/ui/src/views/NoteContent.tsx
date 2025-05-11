import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { ChevronLeft, MoreVertical, Pencil, Send, Trash } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { invoke } from '@tauri-apps/api/core';
import { db, Note, NoteEntry } from "@repo/ui/lib/database";

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
  const [noteEntries, setNoteEntries] = useState<NoteEntry[]>([]);
  const [newEntryText, setNewEntryText] = useState("");
  const entriesEndRef = useRef<null | HTMLDivElement>(null);
  const entriesContainerRef = useRef<null | HTMLDivElement>(null);
  const NOTE_CONTENT_INPUT_HEIGHT = 72;

  useEffect(() => {
    loadNoteEntries();
    setNewEntryText("");
  }, [selectedNote.id]);

  const loadNoteEntries = async () => {
    try {
      const entries = await db.getNoteEntries(selectedNote.id);
      setNoteEntries(entries);
    } catch (error) {
      console.error('Failed to load note entries:', error);
      await invoke('log_message', { level: 'error', message: `Failed to load note entries: ${error}` });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      entriesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  useEffect(() => {
    if (noteEntries.length > 0) {
      scrollToBottom();
    }
  }, [noteEntries]);

  const handleAddEntry = async () => {
    if (newEntryText.trim()) {
      try {
        const newEntry = await db.addNoteEntry(selectedNote.id, newEntryText.trim());
        setNoteEntries(prevEntries => [...prevEntries, newEntry]);
        await invoke('log_message', { level: 'info', message: `Added new entry to note: ${selectedNote.title}` });
        setNewEntryText("");
      } catch (error) {
        console.error('Failed to add note entry:', error);
        await invoke('log_message', { level: 'error', message: `Failed to add note entry: ${error}` });
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAddEntry();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 shrink-0" style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}>
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
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black dark:border-white font-bold text-lg shrink-0">
                {selectedNote.title.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold truncate" title={selectedNote.title}>{selectedNote.title}</h2>
                <div className="flex items-center text-xs italic text-muted-foreground">
                  Created: {new Date(selectedNote.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
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
                  className="text-red-500 hover:!text-red-500 focus:!text-red-500 focus:!bg-red-500/10"
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
      <div className="flex-1 overflow-y-auto p-4" ref={entriesContainerRef}>
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {selectedNote.content && noteEntries.length === 0 && (
            <div className="prose dark:prose-invert max-w-none text-muted-foreground p-4 rounded-md border bg-muted/50">
              <p className="text-sm italic">Initial note content:</p>
              {selectedNote.content}
            </div>
          )}
          {noteEntries.map((entry) => (
            <div key={entry.id} className="flex flex-col items-start">
              <div className="bg-muted p-3 rounded-lg shadow-sm max-w-[80%]">
                <p className="text-sm whitespace-pre-wrap break-words">{entry.text}</p>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {noteEntries.length === 0 && !selectedNote.content && (
            <div className="text-center text-muted-foreground py-10">
              No note content yet...
            </div>
          )}
          <div ref={entriesEndRef} style={{ height: '1px' }} />
        </div>
      </div>
      <div className="border-t p-4 shrink-0" style={{ height: NOTE_CONTENT_INPUT_HEIGHT, minHeight: NOTE_CONTENT_INPUT_HEIGHT }}>
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Input
            type="text"
            placeholder="Add a new note entry..."
            className="flex-1"
            value={newEntryText}
            onChange={(e) => setNewEntryText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            type="button"
            size="icon"
            onClick={handleAddEntry}
            disabled={!newEntryText.trim()}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Add entry</span>
          </Button>
        </div>
      </div>
    </div>
  );
}