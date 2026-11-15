import Delete from '@expo/material-symbols/delete.xml';
import Edit from '@expo/material-symbols/edit.xml';
import Keep from '@expo/material-symbols/keep.xml';
import KeepOff from '@expo/material-symbols/keep_off.xml';
import Label from '@expo/material-symbols/label.xml';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList } from 'react-native';

import { ActionSheet, type SheetAction } from '@/components/action-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { Fab } from '@/components/fab';
import { NameSheet } from '@/components/name-sheet';
import { NoteTagsSheet } from '@/components/note-tags-sheet';
import {
  createNote,
  deleteNote,
  renameNote,
  setNotePinned,
  useNotes,
  type Note,
} from '@/data/notes-store';

import { NoteRow } from './note-row';

export function Notes() {
  const notes = useNotes();
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  // The note whose actions are showing, and the notes being renamed or deleted.
  const [selected, setSelected] = useState<Note | null>(null);
  const [renaming, setRenaming] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState<Note | null>(null);
  const [tagging, setTagging] = useState<string | null>(null);

  const startNewNote = () => setIsCreating(true);

  const openNewNote = (title: string) => {
    const note = createNote(title);
    setIsCreating(false);
    router.push({ pathname: '/note/[id]', params: { id: note.id } });
  };

  // Pinned notes stay on top; within each group the store's recency order holds.
  const ordered = [...notes.filter((note) => note.pinned), ...notes.filter((note) => !note.pinned)];

  const actions: SheetAction[] = selected
    ? [
        selected.pinned
          ? { label: 'Unpin', icon: KeepOff, onPress: () => setNotePinned(selected.id, false) }
          : { label: 'Pin', icon: Keep, onPress: () => setNotePinned(selected.id, true) },
        { label: 'Tags', icon: Label, onPress: () => setTagging(selected.id) },
        { label: 'Rename', icon: Edit, onPress: () => setRenaming(selected) },
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
      {process.env.EXPO_OS === 'ios' && (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button icon="square.and.pencil" onPress={startNewNote} />
        </Stack.Toolbar>
      )}
      <Fab label="New note" icon={Edit} onPress={startNewNote} />
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
