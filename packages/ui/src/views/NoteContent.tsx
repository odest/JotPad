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
import { ChevronLeft, MoreVertical, Pencil, Send, Trash, Notebook, Search, X, ChevronUp, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { invoke } from '@tauri-apps/api/core';
import { db, Note, NoteEntry } from "@repo/ui/lib/database";

interface NoteContentProps {
  selectedNote: Note | null;
  handleEditNote: (note: Note) => void;
  handleDeleteNote: (id: string) => void;
  setShowSidebar: (v: boolean) => void;
  SIDEBAR_HEADER_HEIGHT: number;
  onEntryAdded?: () => void;
  showSidebar: boolean;
}

const formatDateForSeparator = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) {
    return text;
  }
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-400 text-black rounded-[3px] px-0.5 dark:bg-yellow-500 match-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
};


export function NoteContent({
  selectedNote,
  handleEditNote,
  handleDeleteNote,
  setShowSidebar,
  SIDEBAR_HEADER_HEIGHT,
  onEntryAdded,
  showSidebar
}: NoteContentProps) {
  const [noteEntries, setNoteEntries] = useState<NoteEntry[]>([]);
  const [newEntryText, setNewEntryText] = useState("");
  const [editingEntry, setEditingEntry] = useState<NoteEntry | null>(null);
  const [editText, setEditText] = useState("");
  const [searchInEntriesQuery, setSearchInEntriesQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [matches, setMatches] = useState<HTMLElement[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [totalMatches, setTotalMatches] = useState(0);

  const entriesEndRef = useRef<null | HTMLDivElement>(null);
  const entriesContainerRef = useRef<null | HTMLDivElement>(null);
  const searchResultsContainerRef = useRef<null | HTMLDivElement>(null);
  const bottomInputContainerRef = useRef<HTMLDivElement>(null);
  const newEntryInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const NOTE_CONTENT_INPUT_HEIGHT = 72;

  useEffect(() => {
    if (selectedNote) {
      loadNoteEntries();
      setNewEntryText("");
      setSearchInEntriesQuery("");
      setIsSearchActive(false);
      setMatches([]);
      setCurrentMatchIndex(-1);
      setTotalMatches(0);
    }
  }, [selectedNote?.id]);

  useEffect(() => {
    const updateHeight = () => {
      if (entriesContainerRef.current) {
        const availableHeight = window.innerHeight - SIDEBAR_HEADER_HEIGHT - NOTE_CONTENT_INPUT_HEIGHT;
        entriesContainerRef.current.style.height = `${Math.max(availableHeight, 0)}px`;
      }
    };
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (bottomInputContainerRef.current) resizeObserver.observe(bottomInputContainerRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [SIDEBAR_HEADER_HEIGHT, NOTE_CONTENT_INPUT_HEIGHT]);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const loadNoteEntries = async () => {
    if (!selectedNote) return;
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
    if (noteEntries.length > 0 && !searchInEntriesQuery) {
      scrollToBottom();
    }
  }, [noteEntries, searchInEntriesQuery]);

  useEffect(() => {
    if (isSearchActive && searchInEntriesQuery.trim() && searchResultsContainerRef.current) {
      if (currentMatchIndex !== -1 && matches[currentMatchIndex]) {
        matches[currentMatchIndex].classList.remove('active-match-highlight');
      }

      const highlightedElements = Array.from(
        searchResultsContainerRef.current.querySelectorAll('.match-highlight')
      ) as HTMLElement[];
      
      setMatches(highlightedElements);
      setTotalMatches(highlightedElements.length);

      if (highlightedElements.length > 0) {
        setCurrentMatchIndex(0);
      } else {
        setCurrentMatchIndex(-1);
      }
    } else {
      if (currentMatchIndex !== -1 && matches.length > 0 && matches[currentMatchIndex]) {
        matches[currentMatchIndex].classList.remove('active-match-highlight');
      }
      setMatches([]);
      setTotalMatches(0);
      setCurrentMatchIndex(-1);
    }
  }, [searchInEntriesQuery, isSearchActive, noteEntries]);

  useEffect(() => {
    matches.forEach((match, index) => {
      if (index === currentMatchIndex) {
        match.classList.add('active-match-highlight');
        match.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      } else {
        match.classList.remove('active-match-highlight');
      }
    });
  }, [currentMatchIndex, matches]);

  const handleAddEntry = async () => {
    if (!selectedNote || !newEntryText.trim()) return;
    try {
      const newEntry = await db.addNoteEntry(selectedNote.id, newEntryText.trim());
      const preview = newEntryText.trim().length > 40 ? newEntryText.trim().slice(0, 40) + "..." : newEntryText.trim();
      await db.updateNoteContent(selectedNote.id, preview);
      setNoteEntries(prevEntries => [...prevEntries, newEntry]);
      await invoke('log_message', { level: 'info', message: `Added new entry to note: ${selectedNote.title}` });
      setNewEntryText("");
      if (typeof onEntryAdded === 'function') onEntryAdded();
      setTimeout(() => newEntryInputRef.current?.focus(), 0);
    } catch (error) {
      console.error('Failed to add note entry:', error);
      await invoke('log_message', { level: 'error', message: `Failed to add note entry: ${error}` });
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
    if (!selectedNote || !editingEntry || !editText.trim()) return;
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
      const isLastEntry = noteEntries[noteEntries.length - 1]?.id === editingEntry.id;
      if (isLastEntry && typeof onEntryAdded === 'function') onEntryAdded();
    } catch (error) {
      console.error('Failed to edit entry:', error);
      await invoke('log_message', { level: 'error', message: `Failed to edit entry: ${error}` });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!selectedNote) return;
    try {
      await db.deleteNoteEntry(entryId);
      setNoteEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
      await invoke('log_message', { level: 'info', message: `Entry deleted from note: ${selectedNote.title}` });
      const isLastEntry = noteEntries[noteEntries.length - 1]?.id === entryId;
      if (isLastEntry && typeof onEntryAdded === 'function') onEntryAdded();
    } catch (error) {
      console.error('Failed to delete entry:', error);
      await invoke('log_message', { level: 'error', message: `Failed to delete entry: ${error}` });
    }
  };

  const toggleHeaderSearchIcon = () => {
    if (isSearchActive) {
      setSearchInEntriesQuery("");
    }
    setIsSearchActive(!isSearchActive);
  };

  const closeSearchFromBar = () => {
    setIsSearchActive(false);
    setSearchInEntriesQuery("");
  };

  const handleNavigateMatch = (direction: 'next' | 'prev') => {
    if (totalMatches === 0) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentMatchIndex + 1) % totalMatches;
    } else {
      nextIndex = (currentMatchIndex - 1 + totalMatches) % totalMatches;
    }
    setCurrentMatchIndex(nextIndex);
  };

  const filteredEntries = noteEntries.filter(entry =>
    entry.text.toLowerCase().includes(searchInEntriesQuery.toLowerCase())
  );

  if (!selectedNote) {
    return (
      <div className={`flex-1 flex flex-col h-[calc(100vh)] md:h-[calc(100vh-2.5rem)] md:border md:m-5 md:mb-5 rounded-xl ${!showSidebar ? 'block' : 'hidden md:block'} bg-background`}>
        <div className="flex-1 flex justify-center items-center h-[calc(100vh-2.5rem)]">
          <div className="flex flex-col items-center justify-center">
            <Notebook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-center">Select a note</h3>
            <p className="text-gray-500 mt-2 text-center">Choose a note from the sidebar or create a new one</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-[calc(100vh)] md:h-[calc(100vh-2.5rem)] md:border md:m-5 md:mb-5 rounded-xl ${!showSidebar ? 'block' : 'hidden md:block'} bg-background`}>
      <div className="flex flex-col h-full">
        <div className="border-b p-4 shrink-0" style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}>
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
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black dark:border-white font-bold text-lg shrink-0">
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

        <div
          className="flex-1 overflow-y-auto p-4 custom-scrollbar"
          ref={entriesContainerRef}
        >
          <div className="max-w-3xl mx-auto w-full" ref={searchResultsContainerRef}>
            {isSearchActive && (
              <div className="sticky top-0 z-10 p-2 mb-3 bg-primary/5 backdrop-blur-md rounded-lg shadow-sm">
                <div className="flex items-center gap-2 px-1">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search in entries..."
                    className="flex-1 h-9 text-sm"
                    value={searchInEntriesQuery}
                    onChange={(e) => setSearchInEntriesQuery(e.target.value)}
                  />
                  {totalMatches > 0 && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums px-1">
                      {currentMatchIndex + 1} / {totalMatches}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigateMatch('prev')}
                    disabled={totalMatches === 0}
                    className="shrink-0 h-9 w-9"
                  >
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigateMatch('next')}
                    disabled={totalMatches === 0}
                    className="shrink-0 h-9 w-9"
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeSearchFromBar}
                    className="shrink-0 h-9 w-9"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            )}

            {selectedNote.content && noteEntries.length === 0 && !searchInEntriesQuery && !isSearchActive && (
              <div className="text-center text-muted-foreground py-10">
                No note content yet...
              </div>
            )}
            {(() => {
              let lastDisplayedDate: string | null = null;
              return filteredEntries.map((entry) => {
                const entryDateStr = formatDateForSeparator(entry.timestamp);
                const showDateSeparator = entryDateStr !== lastDisplayedDate;
                if (showDateSeparator) {
                  lastDisplayedDate = entryDateStr;
                }

                return (
                  <React.Fragment key={entry.id}>
                    {showDateSeparator && (
                      <div className="flex justify-center my-3">
                        <div className="bg-primary/80 text-background text-xs font-medium px-2.5 py-1 rounded-md shadow">
                          {entryDateStr}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col items-end w-full mb-5">
                      <ContextMenu>
                        {editingEntry?.id === entry.id ? (
                          <ContextMenuTrigger asChild>
                            <div
                              className="bg-muted p-4 rounded-2xl shadow-sm 
                                        block max-w-[90%] md:max-w-[70%] 
                                        min-w-[280px] md:min-w-[320px]"
                            >
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
                                style={{ minWidth: '100%' }}
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
                          <ContextMenuTrigger asChild>
                            <div
                              className="bg-muted p-3 rounded-xl shadow-sm 
                                        inline-block 
                                        max-w-[85%] md:max-w-[70%] 
                                        text-left 
                                        "
                              style={{ wordBreak: 'break-word', minWidth: '70px'}}
                            >
                              <p className="text-[15px] md:text-sm whitespace-pre-wrap leading-relaxed">
                                {highlightText(entry.text, searchInEntriesQuery)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 text-right">
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
                  </React.Fragment>
                );
              });
            })()}

            {searchInEntriesQuery && filteredEntries.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                No entries found matching your search.
              </div>
            )}

            {noteEntries.length === 0 && !selectedNote.content && !searchInEntriesQuery && !isSearchActive &&(
              <div className="text-center text-muted-foreground py-10">
                No note content yet...
              </div>
            )}
            <div ref={entriesEndRef} style={{ height: '1px' }} />
          </div>
        </div>

        <div
          ref={bottomInputContainerRef}
          className="border-t p-4 shrink-0 sticky bottom-0 z-10 bg-transparent"
          style={{ height: NOTE_CONTENT_INPUT_HEIGHT, minHeight: NOTE_CONTENT_INPUT_HEIGHT }}
        >
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <Input
              type="text"
              placeholder="Add a new note entry..."
              className="flex-1"
              value={newEntryText}
              onChange={(e) => setNewEntryText(e.target.value)}
              onKeyDown={handleKeyPress}
              ref={newEntryInputRef}
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
    </div>
  );
}
