import { Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { groupPosition } from '@/components/group-position';
import { GroupedRow } from '@/components/grouped-row';
import { useAllEntries, useNotes, type Note } from '@/data/notes-store';
import { NoteRow } from '@/screens/notes/note-row';
import { useT } from '@/i18n';

import { SearchField } from './search-field';

type Result = { note: Note; preview?: string };

export function Search() {
  const t = useT();
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();
  const isAndroid = process.env.EXPO_OS === 'android';
  const notes = useNotes();
  const entries = useAllEntries();

  const needle = query.trim().toLowerCase();
  const results: Result[] = [];
  if (needle) {
    for (const note of notes) {
      // Newest matching entry wins as the preview line.
      const match = entries[note.id]?.findLast((entry) =>
        entry.body.toLowerCase().includes(needle),
      );
      if (match || note.title.toLowerCase().includes(needle)) {
        results.push({ note, preview: match?.body });
      }
    }
  }

  return (
    <>
      {isAndroid ? (
        // Material search bar in place of the top app bar.
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <View className="bg-surface px-4 pb-2" style={{ paddingTop: insets.top + 8 }}>
            <SearchField value={query} onChangeText={setQuery} placeholder={t.search.placeholder} />
          </View>
        </>
      ) : (
        <Stack.Screen
          options={{
            headerSearchBarOptions: {
              placeholder: t.search.placeholder,
              autoCapitalize: 'none',
              onChangeText: (event) => setQuery(event.nativeEvent.text),
              onCancelButtonPress: () => setQuery(''),
            },
          }}
        />
      )}
      <FlatList
        className="bg-surface"
        contentContainerClassName="grow android:pt-2"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        data={results}
        keyExtractor={(result) => result.note.id}
        renderItem={({ item, index }) => (
          <GroupedRow position={groupPosition(index, results.length)}>
            <NoteRow note={item.note} preview={item.preview} />
          </GroupedRow>
        )}
        ListEmptyComponent={
          needle ? (
            <EmptyState
              icon={{ ios: 'magnifyingglass', android: 'search_off' }}
              title={t.search.noResultsTitle}
              message={t.search.noResultsMessage(query.trim())}
            />
          ) : (
            <EmptyState
              icon={{ ios: 'magnifyingglass', android: 'search' }}
              title={t.search.emptyTitle}
              message={t.search.emptyMessage}
            />
          )
        }
      />
    </>
  );
}
