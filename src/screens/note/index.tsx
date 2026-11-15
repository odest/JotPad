import { Stack } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useEffect, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { addEntry, useEntries, useNote, type Entry } from '@/data/notes-store';
import { usePalette } from '@/theme';
import { isSameDay } from '@/utils/format-time';

import { Composer } from './composer';
import { EntryBubble, type EntryItem } from './entry-bubble';

/** Entries sent within this window of each other are shown as one group. */
const GROUP_WINDOW_MS = 2 * 60 * 1000;

/** Newest first, because the list is inverted to stay anchored to the latest entry. */
function toItems(entries: Entry[]): EntryItem[] {
  const joins = (a: Entry | undefined, b: Entry | undefined) =>
    !!a &&
    !!b &&
    isSameDay(a.createdAt, b.createdAt) &&
    Math.abs(a.createdAt - b.createdAt) < GROUP_WINDOW_MS;

  return entries
    .map((entry, index) => {
      const previous = entries[index - 1];
      return {
        entry,
        startsDay: !previous || !isSameDay(previous.createdAt, entry.createdAt),
        joinsPrevious: joins(previous, entry),
        joinsNext: joins(entry, entries[index + 1]),
      };
    })
    .reverse();
}

function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return open;
}

export function NoteChat({ noteId }: { noteId: string }) {
  const note = useNote(noteId);
  const entries = useEntries(noteId);
  const palette = usePalette();
  const insets = useSafeAreaInsets();

  const headerHeight = useHeaderHeight();
  const keyboardOpen = useKeyboardOpen();

  return (
    <>
      <Stack.Screen options={{ title: note?.title ?? '' }} />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
        // Closed, the composer clears the system navigation bar; open, the keyboard covers it.
        style={{
          flex: 1,
          backgroundColor: palette.surface,
          paddingBottom: keyboardOpen ? 0 : insets.bottom,
        }}
      >
        {entries.length === 0 ? (
          <EmptyState
            icon={{ ios: 'text.bubble', android: 'chat_bubble' }}
            title="Nothing here yet"
            message="Write your first message below."
          />
        ) : (
          <FlatList
            inverted
            data={toItems(entries)}
            keyExtractor={(item) => item.entry.id}
            renderItem={({ item }) => <EntryBubble item={item} />}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="px-3 py-2"
          />
        )}
        <Composer onSend={(body) => addEntry(noteId, body)} />
      </KeyboardAvoidingView>
    </>
  );
}
