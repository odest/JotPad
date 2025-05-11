import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@repo/ui/components/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@repo/ui/components/context-menu";
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
  onEntryAdded?: () => void;
}

export function NoteContent({
  selectedNote,
  handleEditNote,
  handleDeleteNote,
  setShowSidebar,
  SIDEBAR_HEADER_HEIGHT,
  onEntryAdded
}: NoteContentProps) {
  const [noteEntries, setNoteEntries] = useState<NoteEntry[]>([]);
  const [newEntryText, setNewEntryText] = useState("");
  const [editingEntry, setEditingEntry] = useState<NoteEntry | null>(null);
  const [editText, setEditText] = useState("");
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
        const preview = newEntryText.trim().length > 40 ? newEntryText.trim().slice(0, 40) + "..." : newEntryText.trim();
        await db.updateNoteContent(selectedNote.id, preview);
        setNoteEntries(prevEntries => [...prevEntries, newEntry]);
        await invoke('log_message', { level: 'info', message: `Added new entry to note: ${selectedNote.title}` });
        setNewEntryText("");
        if (typeof onEntryAdded === 'function') onEntryAdded();
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

  const handleEditEntry = async (entry: NoteEntry) => {
    setEditingEntry(entry);
    setEditText(entry.text);
  };

  const handleSaveEdit = async () => {
    if (editingEntry && editText.trim()) {
      try {
        await db.execute(
          'UPDATE note_entries SET text = ? WHERE id = ?',
          [editText.trim(), editingEntry.id]
        );
        setNoteEntries(prevEntries =>
          prevEntries.map(entry =>
            entry.id === editingEntry.id ? { ...entry, text: editText.trim() } : entry
          )
        );
        setEditingEntry(null);
        setEditText("");
        await invoke('log_message', { level: 'info', message: `Entry edited in note: ${selectedNote.title}` });
        
        // Check if this was the last entry and update sidebar preview
        const isLastEntry = noteEntries[noteEntries.length - 1]?.id === editingEntry.id;
        if (isLastEntry && typeof onEntryAdded === 'function') {
          onEntryAdded();
        }
      } catch (error) {
        console.error('Failed to edit entry:', error);
        await invoke('log_message', { level: 'error', message: `Failed to edit entry: ${error}` });
      }
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await db.deleteNoteEntry(entryId);
      setNoteEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
      await invoke('log_message', { level: 'info', message: `Entry deleted from note: ${selectedNote.title}` });
      
      // Check if this was the last entry and update sidebar preview
      const isLastEntry = noteEntries[noteEntries.length - 1]?.id === entryId;
      if (isLastEntry && typeof onEntryAdded === 'function') {
        onEntryAdded();
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      await invoke('log_message', { level: 'error', message: `Failed to delete entry: ${error}` });
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
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" ref={entriesContainerRef}>
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {selectedNote.content && noteEntries.length === 0 && (
            <div className="prose dark:prose-invert max-w-none text-muted-foreground p-4 rounded-md border bg-muted/50">
              <p className="text-sm italic">Initial note content:</p>
              {selectedNote.content}
            </div>
          )}
          {noteEntries.map((entry) => (
            <div key={entry.id} className="flex flex-col items-start w-full">
              <ContextMenu>
                {editingEntry?.id === entry.id ? (
                  <ContextMenuTrigger className="block w-auto max-w-full md:max-w-[70%] min-w-[180px] self-start">
                    <div className="bg-muted p-4 rounded-2xl shadow-sm w-auto max-w-[95%] md:max-w-[70%] min-w-[180px] block self-start mb-2 md:mb-3 transition-all">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEdit();
                          }
                        }}
                        className="mb-4 text-lg border-2 border-primary bg-background/80 shadow focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                        style={{ minWidth: '140px' }}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 w-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEntry(null);
                            setEditText("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                ) : (
                  <ContextMenuTrigger className="block w-auto max-w-full md:max-w-[60%] min-w-[120px] self-start">
                    <div
                      className="bg-muted p-3 rounded-xl shadow-sm w-auto max-w-[90%] md:max-w-[60%] min-w-[120px] block self-start mb-2 md:mb-3 transition-all"
                      style={{ wordBreak: 'break-word' }}
                    >
                      <p className="text-[15px] md:text-sm whitespace-pre-wrap leading-relaxed">{entry.text}</p>
                      <p className="text-xs text-muted-foreground mt-2 text-right">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </ContextMenuTrigger>
                )}
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleEditEntry(entry)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
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