import { Stack, useRouter } from 'expo-router';
import { FlatList } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Fab } from '@/components/fab';
import { useNotes } from '@/data/notes-store';

import { NoteRow } from './note-row';

export function Notes() {
  const notes = useNotes();
  const router = useRouter();
  const startNewNote = () => router.push('/new-note');

  return (
    <>
      <FlatList
        className="bg-surface"
        // Leaves room for the FAB below the last row on Android.
        contentContainerClassName="grow android:pb-16"
        contentInsetAdjustmentBehavior="automatic"
        data={notes}
        keyExtractor={(note) => note.id}
        renderItem={({ item }) => <NoteRow note={item} />}
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
      <Fab label="New note" onPress={startNewNote} />
    </>
  );
}
