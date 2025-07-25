import React, { useState, useEffect, useRef } from "react";
import { convertFileSrc } from '@tauri-apps/api/core';
import { useTranslation } from 'react-i18next';
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
import { PinnedEntriesList } from "@repo/ui/components/note/PinnedEntriesList";

declare global {
  interface Window {
    androidBackCallback?: () => boolean;
  }
}

interface NoteContentProps {
  selectedNote: Note | null;
  handleEditNote: (note: Note) => void;
  handleDeleteNote: (id: string) => void;
  handleTogglePinNote?: (noteId: string, pinned: boolean) => void;
  setShowSidebar: (v: boolean) => void;
  SIDEBAR_HEADER_HEIGHT: number;
  onEntryAdded?: () => void;
  showSidebar: boolean;
}

export function NoteContent({
  selectedNote,
  handleEditNote,
  handleDeleteNote,
  handleTogglePinNote,
  setShowSidebar,
  SIDEBAR_HEADER_HEIGHT,
  onEntryAdded,
  showSidebar
}: NoteContentProps) {
  const { t } = useTranslation();
  const [newEntryText, setNewEntryText] = useState("");
  const [editingEntry, setEditingEntry] = useState<NoteEntry | null>(null);
  const [entryIdToDelete, setEntryIdToDelete] = useState<string | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const entriesEndRef = useRef<null | HTMLDivElement>(null);
  const searchResultsContainerRef = useRef<null | HTMLDivElement>(null);
  const newEntryInputRef = useRef<HTMLTextAreaElement>(null);

  const { backgroundSettings } = useTheme();

  const {
    noteEntries,
    addEntry,
    editEntry,
    deleteEntry,
    pinnedEntries,
    togglePinEntry
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
    if (noteEntries.length > 0 && !searchQuery) {
      setTimeout(() => {
        entriesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [noteEntries, searchQuery]);

  useEffect(() => {
    window.androidBackCallback = (): boolean => {
      if (entryIdToDelete) {
        setEntryIdToDelete(null);
        return false;
      }
      if (isExportDialogOpen) {
        setIsExportDialogOpen(false);
        return false;
      }
      if (showSidebar) {
        return true;
      }
      setShowSidebar(true);
      return false;
    };
    return () => {
      window.androidBackCallback = undefined;
    };
  }, [entryIdToDelete, isExportDialogOpen, showSidebar, setShowSidebar]);

  const handleAddOrEditEntry = async () => {
    if (editingEntry) {
      if (!editingEntry || !newEntryText.trim()) return;
      const success = await editEntry(editingEntry.id, newEntryText.trim());
      if (success) {
        setEditingEntry(null);
        setNewEntryText("");
      }
    } else {
      if (!selectedNote || !newEntryText.trim()) return;
      const success = await addEntry(newEntryText.trim());
      if (success) {
        setNewEntryText("");
        setTimeout(() => newEntryInputRef.current?.focus(), 0);
      }
    }
  };

  const handleEditEntry = (entry: NoteEntry) => {
    setEditingEntry(entry);
    setNewEntryText(entry.text);
    setTimeout(() => newEntryInputRef.current?.focus(), 0);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setNewEntryText("");
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntryIdToDelete(entryId);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAddOrEditEntry();
    }
  };

  const getBackgroundStyle = () => {
    if (!backgroundSettings.show_background) return {};

    const imageUrl = backgroundSettings.use_custom_image && backgroundSettings.custom_image_src
      ? `url(${convertFileSrc(backgroundSettings.custom_image_src)})`
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
          handleTogglePinNote={handleTogglePinNote}
          setShowSidebar={setShowSidebar}
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          setSearchQuery={setSearchQuery}
          SIDEBAR_HEADER_HEIGHT={SIDEBAR_HEADER_HEIGHT}
          isExportDialogOpen={isExportDialogOpen}
          setIsExportDialogOpen={setIsExportDialogOpen}
        />

        <div
          className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-20"
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
            <PinnedEntriesList
              pinnedEntries={pinnedEntries}
              onUnpin={(entryId) => togglePinEntry(entryId, false)}
              onGoToEntry={(entryId) => {
                const el = document.getElementById(`entry-${entryId}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              isSearchActive={isSearchActive}
            />
            <NoteEntriesList
              selectedNote={selectedNote}
              filteredEntries={filteredEntries}
              searchQuery={searchQuery}
              isSearchActive={isSearchActive}
              editingEntry={editingEntry}
              editText={newEntryText}
              setEditText={setNewEntryText}
              handleEditEntry={handleEditEntry}
              handleSaveEdit={handleAddOrEditEntry}
              handleDeleteEntry={handleDeleteEntry}
              setEditingEntry={setEditingEntry}
              noteEntries={noteEntries}
              handleTogglePinEntry={togglePinEntry}
            />
            <div ref={entriesEndRef} style={{ height: '1px' }} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <AddEntryInput
              newEntryText={newEntryText}
              setNewEntryText={setNewEntryText}
              handleKeyPress={handleKeyPress}
              handleAddEntry={handleAddOrEditEntry}
              newEntryInputRef={newEntryInputRef}
              isEditing={!!editingEntry}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        </div>
      </div>

      <Dialog open={!!entryIdToDelete} onOpenChange={open => { if (!open) setEntryIdToDelete(null); }}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('delete_entry')}</DialogTitle>
          </DialogHeader>
          <div>{t('delete_entry_confirm')}</div>
          <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setEntryIdToDelete(null)}>
              {t('cancel')}
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
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}