import React from "react";
import { useTranslation } from 'react-i18next';
import { Note, NoteEntry } from "@repo/ui/lib/database";
import { NoteEntryItem } from "@repo/ui/components/note/NoteEntryItem";
import { formatDateForSeparator } from "@repo/ui/lib/utils";

interface NoteEntriesListProps {
  selectedNote: Note;
  filteredEntries: NoteEntry[];
  searchQuery: string;
  isSearchActive: boolean;
  editingEntry: NoteEntry | null;
  editText: string;
  setEditText: (text: string) => void;
  handleEditEntry: (entry: NoteEntry) => void;
  handleSaveEdit: () => void;
  handleDeleteEntry: (entryId: string) => void;
  setEditingEntry: (entry: NoteEntry | null) => void;
  noteEntries: NoteEntry[];
  handleTogglePinEntry?: (entryId: string, pinned: boolean) => void;
}

export function NoteEntriesList({
  selectedNote,
  filteredEntries,
  searchQuery,
  isSearchActive,
  editingEntry,
  editText,
  setEditText,
  handleEditEntry,
  handleSaveEdit,
  handleDeleteEntry,
  setEditingEntry,
  noteEntries,
  handleTogglePinEntry
}: NoteEntriesListProps) {
  const { t } = useTranslation();
  if (selectedNote.content && noteEntries.length === 0 && !searchQuery && !isSearchActive) {
    return (
      <div className="text-center text-muted-foreground py-10">
        {t('no_note_content_yet')}
      </div>
    );
  }

  if (searchQuery && filteredEntries.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        {t('no_entries_found')}
      </div>
    );
  }

  if (noteEntries.length === 0 && !selectedNote.content && !searchQuery && !isSearchActive) {
    return (
      <div className="text-center text-muted-foreground py-10">
        {t('no_note_content_yet')}
      </div>
    );
  }

  let lastDisplayedDate: string | null = null;

  return (
    <>
      {filteredEntries.map((entry) => {
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
            <NoteEntryItem
              entry={entry}
              searchQuery={searchQuery}
              editingEntry={editingEntry}
              editText={editText}
              setEditText={setEditText}
              handleEditEntry={handleEditEntry}
              handleSaveEdit={handleSaveEdit}
              handleDeleteEntry={handleDeleteEntry}
              setEditingEntry={setEditingEntry}
              handleTogglePinEntry={handleTogglePinEntry}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}