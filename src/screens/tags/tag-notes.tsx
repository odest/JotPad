import { Stack } from 'expo-router';
import { FlatList } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { groupPosition } from '@/components/group-position';
import { GroupedRow } from '@/components/grouped-row';
import { useNotes, useTag } from '@/data/notes-store';
import { NoteRow } from '@/screens/notes/note-row';
import { t } from '@/i18n';

/** The notes that carry one tag. */
export function TagNotes({ tagId }: { tagId: string }) {
  const tag = useTag(tagId);
  const notes = useNotes().filter((note) => note.tagIds.includes(tagId));

  return (
    <>
      <Stack.Screen options={{ title: tag?.name ?? '' }} />
      <FlatList
        className="bg-surface"
        contentContainerClassName="grow android:pt-2"
        contentInsetAdjustmentBehavior="automatic"
        data={notes}
        keyExtractor={(note) => note.id}
        renderItem={({ item, index }) => (
          <GroupedRow position={groupPosition(index, notes.length)}>
            <NoteRow note={item} />
          </GroupedRow>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={{ ios: 'tag', android: 'label' }}
            title={t.tags.tagEmptyTitle}
            message={t.tags.tagEmptyMessage}
          />
        }
      />
    </>
  );
}
