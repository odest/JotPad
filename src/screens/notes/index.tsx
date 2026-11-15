import Delete from '@expo/material-symbols/delete.xml';
import Edit from '@expo/material-symbols/edit.xml';
import IosShare from '@expo/material-symbols/ios_share.xml';
import Keep from '@expo/material-symbols/keep.xml';
import KeepOff from '@expo/material-symbols/keep_off.xml';
import Label from '@expo/material-symbols/label.xml';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList } from 'react-native';

import { ActionSheet, type SheetAction } from '@/components/action-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { ExportSheet } from '@/components/export-sheet';
import { Fab } from '@/components/fab';
import { useFabExpanded } from '@/components/use-fab-expanded';
import { NameSheet } from '@/components/name-sheet';
import { NoteTagsSheet } from '@/components/note-tags-sheet';
import {
  createNote,
  deleteNote,
  renameNote,
  setNotePinned,
  useAllEntries,
  useNotes,
  useTags,
  type Note,
} from '@/data/notes-store';
import { useNoteSort } from '@/data/preferences';

import { NoteRow } from './note-row';
import { NotesHeader } from './notes-header';
import { sortNotes } from './sort-notes';

export function Notes() {
  const notes = useNotes();
  const sort = useNoteSort();
  const fab = useFabExpanded();
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  // The note whose actions are showing, and the notes being renamed or deleted.
  const [selected, setSelected] = useState<Note | null>(null);
  const [renaming, setRenaming] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState<Note | null>(null);
  const [tagging, setTagging] = useState<string | null>(null);
  const [exporting, setExporting] = useState<Note | null>(null);
  const entries = useAllEntries();
  const tags = useTags();

  const startNewNote = () => setIsCreating(true);

  const openNewNote = (title: string) => {
    const note = createNote(title);
    setIsCreating(false);
    router.push({ pathname: '/note/[id]', params: { id: note.id } });
  };

  const ordered = sortNotes(notes, sort);

  const actions: SheetAction[] = selected
    ? [
        selected.pinned
          ? { label: 'Unpin', icon: KeepOff, onPress: () => setNotePinned(selected.id, false) }
          : { label: 'Pin', icon: Keep, onPress: () => setNotePinned(selected.id, true) },
        { label: 'Tags', icon: Label, onPress: () => setTagging(selected.id) },
        { label: 'Rename', icon: Edit, onPress: () => setRenaming(selected) },
        { label: 'Export', icon: IosShare, onPress: () => setExporting(selected) },
        { label: 'Delete', icon: Delete, destructive: true, onPress: () => setDeleting(selected) },
      ]
    : [];

  return (
    <>
      <FlatList
        className="bg-surface"
        // Leaves room for the FAB below the last row on Android.
        contentContainerClassName="grow android:pb-16"
        contentInsetAdjustmentBehavior="automatic"
        data={ordered}
        onScroll={fab.onScroll}
        scrollEventThrottle={16}
        keyExtractor={(note) => note.id}
        renderItem={({ item }) => <NoteRow note={item} onLongPress={setSelected} />}
        ListEmptyComponent={
          <EmptyState
            icon={{ ios: 'bubble.left.and.bubble.right', android: 'forum' }}
            title="No notes yet"
            message="Create a note and jot things down like you are messaging yourself."
          />
        }
      />
      <NotesHeader sort={sort} onNewNote={startNewNote} />
      <Fab label="New note" icon={Edit} expanded={fab.expanded} onPress={startNewNote} />
      <NameSheet
        isPresented={isCreating}
        heading="New note"
        placeholder="Title"
        submitLabel="Create"
        onDismiss={() => setIsCreating(false)}
        onSubmit={openNewNote}
      />
      <NameSheet
        // Remounts per note so the field starts from that note's title.
        key={renaming?.id ?? 'rename'}
        isPresented={renaming !== null}
        heading="Rename note"
        placeholder="Title"
        submitLabel="Save"
        initialValue={renaming?.title}
        onDismiss={() => setRenaming(null)}
        onSubmit={(title) => {
          if (renaming) renameNote(renaming.id, title);
          setRenaming(null);
        }}
      />
      <NoteTagsSheet noteId={tagging} onDismiss={() => setTagging(null)} />
      <ExportSheet
        isPresented={exporting !== null}
        onDismiss={() => setExporting(null)}
        name={exporting?.title ?? ''}
        data={() => ({
          notes: exporting ? [exporting] : [],
          entries: exporting ? { [exporting.id]: entries[exporting.id] ?? [] } : {},
          tags,
        })}
      />
      <ActionSheet
        isPresented={selected !== null}
        onDismiss={() => setSelected(null)}
        actions={actions}
      />
      <ConfirmDialog
        isPresented={deleting !== null}
        title="Delete note?"
        message={`"${deleting?.title ?? ''}" and all of its messages will be deleted.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleting && deleteNote(deleting.id)}
        onDismiss={() => setDeleting(null)}
      />
    </>
  );
}
