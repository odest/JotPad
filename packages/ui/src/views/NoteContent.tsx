import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { useSearch } from "@repo/ui/hooks/useSearch";
import { Note, NoteEntry } from "@repo/ui/lib/database";
import { SearchBar } from "@repo/ui/components/note/SearchBar";
import { NoteHeader } from "@repo/ui/components/note/NoteHeader";
import { EmptyState } from "@repo/ui/components/note/EmptyState";
import { AddEntryInput } from "@repo/ui/components/note/AddEntryInput";
import { NoteEntriesList } from "@repo/ui/components/note/NoteEntriesList";
import { useTheme } from "@repo/ui/providers/theme-provider";
import { useNoteEntries } from "@repo/ui/hooks/useNoteEntries";

interface NoteContentProps {
  selectedNote: Note | null;
  handleEditNote: (note: Note) => void;
  handleDeleteNote: (id: string) => void;
  setShowSidebar: (v: boolean) => void;
  SIDEBAR_HEADER_HEIGHT: number;
  onEntryAdded?: () => void;
  showSidebar: boolean;
}

export function NoteContent({
  selectedNote,
  handleEditNote,
  handleDeleteNote,
  setShowSidebar,
  SIDEBAR_HEADER_HEIGHT,
  onEntryAdded,
  showSidebar
}: NoteContentProps) {
  const [newEntryText, setNewEntryText] = useState("");
  const [editingEntry, setEditingEntry] = useState<NoteEntry | null>(null);
  const [editText, setEditText] = useState("");
  const [entryIdToDelete, setEntryIdToDelete] = useState<string | null>(null);

  const entriesEndRef = useRef<null | HTMLDivElement>(null);
  const entriesContainerRef = useRef<null | HTMLDivElement>(null);
  const searchResultsContainerRef = useRef<null | HTMLDivElement>(null);
  const bottomInputContainerRef = useRef<HTMLDivElement>(null);
  const newEntryInputRef = useRef<HTMLInputElement>(null);
  const NOTE_CONTENT_INPUT_HEIGHT = 72;

  const { backgroundSettings } = useTheme();

  const {
    noteEntries,
    addEntry,
    editEntry,
    deleteEntry
  } = useNoteEntries(selectedNote, onEntryAdded);

  const {
    searchQuery,
    setSearchQuery,
    isSearchActive,
    setIsSearchActive,
    currentMatchIndex,
    totalMatches,
    handleNavigateMatch,
    filteredEntries
  } = useSearch(noteEntries, searchResultsContainerRef);

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
    if (noteEntries.length > 0 && !searchQuery) {
      setTimeout(() => {
        entriesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [noteEntries, searchQuery]);

  const handleAddEntry = async () => {
    if (!selectedNote || !newEntryText.trim()) return;
    const success = await addEntry(newEntryText.trim());
    if (success) {
      setNewEntryText("");
      setTimeout(() => newEntryInputRef.current?.focus(), 0);
    }
  };

  const handleEditEntry = async (entry: NoteEntry) => {
    setEditingEntry(entry);
    setEditText(entry.text);
  };

  const handleSaveEdit = async () => {
    if (!editingEntry || !editText.trim()) return;
    const success = await editEntry(editingEntry.id, editText.trim());
    if (success) {
      setEditingEntry(null);
      setEditText("");
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntryIdToDelete(entryId);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAddEntry();
    }
  };

  const getBackgroundStyle = () => {
    if (!backgroundSettings.show_background) return {};

    const imageUrl = backgroundSettings.use_custom_image && backgroundSettings.custom_image_src
      ? `url(${backgroundSettings.custom_image_src})`
      : 'url(/background.png)';

    return {
      backgroundImage: imageUrl,
      opacity: backgroundSettings.opacity / 100,
      filter: `brightness(${backgroundSettings.brightness / 100}) blur(${backgroundSettings.blur}px)`,
    };
  };

  if (!selectedNote) {
    return <EmptyState showSidebar={showSidebar} />;
  }

  return (
    <div className={`relative flex-1 flex flex-col h-[calc(100vh)] md:h-[calc(100vh-2.5rem)] md:border md:m-5 md:mb-5 rounded-xl overflow-hidden ${!showSidebar ? 'block' : 'hidden md:block'} bg-background`}>
      {backgroundSettings.show_background && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={getBackgroundStyle()}
        />
      )}

      <div className="relative z-[1] flex flex-col h-full">
        <NoteHeader
          selectedNote={selectedNote}
          handleEditNote={handleEditNote}
          handleDeleteNote={handleDeleteNote}
          setShowSidebar={setShowSidebar}
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          setSearchQuery={setSearchQuery}
          SIDEBAR_HEADER_HEIGHT={SIDEBAR_HEADER_HEIGHT}
        />

        <div
          className="flex-1 overflow-y-auto p-4 custom-scrollbar"
          ref={entriesContainerRef}
        >
          <div className="max-w-3xl mx-auto w-full" ref={searchResultsContainerRef}>
            {isSearchActive && (
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setIsSearchActive={setIsSearchActive}
                currentMatchIndex={currentMatchIndex}
                totalMatches={totalMatches}
                handleNavigateMatch={handleNavigateMatch}
              />
            )}

            <NoteEntriesList
              selectedNote={selectedNote}
              filteredEntries={filteredEntries}
              searchQuery={searchQuery}
              isSearchActive={isSearchActive}
              editingEntry={editingEntry}
              editText={editText}
              setEditText={setEditText}
              handleEditEntry={handleEditEntry}
              handleSaveEdit={handleSaveEdit}
              handleDeleteEntry={handleDeleteEntry}
              setEditingEntry={setEditingEntry}
              noteEntries={noteEntries}
            />

            <div ref={entriesEndRef} style={{ height: '1px' }} />
          </div>
        </div>

        <AddEntryInput
          newEntryText={newEntryText}
          setNewEntryText={setNewEntryText}
          handleKeyPress={handleKeyPress}
          handleAddEntry={handleAddEntry}
          newEntryInputRef={newEntryInputRef}
          bottomInputContainerRef={bottomInputContainerRef}
          NOTE_CONTENT_INPUT_HEIGHT={NOTE_CONTENT_INPUT_HEIGHT}
        />
      </div>

      <Dialog open={!!entryIdToDelete} onOpenChange={open => { if (!open) setEntryIdToDelete(null); }}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this entry? This action cannot be undone.</div>
          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setEntryIdToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (entryIdToDelete) {
                  await deleteEntry(entryIdToDelete);
                  setEntryIdToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}