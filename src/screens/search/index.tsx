import { Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { useAllEntries, useNotes, type Note } from '@/data/notes-store';
import { NoteRow } from '@/screens/notes/note-row';

type Result = { note: Note; preview?: string };

export function Search() {
  const [query, setQuery] = useState('');
  const notes = useNotes();
  const entries = useAllEntries();

  const needle = query.trim().toLowerCase();
  const results: Result[] = [];
  if (needle) {
    for (const note of notes) {
      // Newest matching entry wins as the preview line.
      const match = entries[note.id]?.findLast((entry) => entry.body.toLowerCase().includes(needle));
      if (match || note.title.toLowerCase().includes(needle)) {
        results.push({ note, preview: match?.body });
      }
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: 'Search notes',
            autoCapitalize: 'none',
            onChangeText: (event) => setQuery(event.nativeEvent.text),
            onCancelButtonPress: () => setQuery(''),
            onClose: () => setQuery(''),
          },
        }}
      />
      <FlatList
        className="bg-surface"
        contentContainerClassName="grow"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        data={results}
        keyExtractor={(result) => result.note.id}
        renderItem={({ item }) => <NoteRow note={item.note} preview={item.preview} />}
        ListEmptyComponent={
          needle ? (
            <EmptyState
              icon={{ ios: 'magnifyingglass', android: 'search_off' }}
              title="No results"
              message={`Nothing matches "${query.trim()}".`}
            />
          ) : (
            <EmptyState
              icon={{ ios: 'magnifyingglass', android: 'search' }}
              title="Search your notes"
              message="Find a note by its title or by anything you wrote in it."
            />
          )
        }
      />
    </>
  );
}
