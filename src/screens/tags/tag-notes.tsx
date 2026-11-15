import { Stack } from 'expo-router';
import { FlatList } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { useNotes, useTag } from '@/data/notes-store';
import { NoteRow } from '@/screens/notes/note-row';

/** The notes that carry one tag. */
export function TagNotes({ tagId }: { tagId: string }) {
  const tag = useTag(tagId);
  const notes = useNotes().filter((note) => note.tagIds.includes(tagId));

  return (
    <>
      <Stack.Screen options={{ title: tag?.name ?? '' }} />
      <FlatList
        className="bg-surface"
        contentContainerClassName="grow"
        contentInsetAdjustmentBehavior="automatic"
        data={notes}
        keyExtractor={(note) => note.id}
        renderItem={({ item }) => <NoteRow note={item} />}
        ListEmptyComponent={
          <EmptyState
            icon={{ ios: 'tag', android: 'label' }}
            title="No notes with this tag"
            message="Long-press a note and choose Tags to add it here."
          />
        }
      />
    </>
  );
}
