import { Stack } from 'expo-router';
import { FlatList } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
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

export function NoteChat({ noteId }: { noteId: string }) {
  const note = useNote(noteId);
  const entries = useEntries(noteId);
  const palette = usePalette();
  const insets = useSafeAreaInsets();

  // The keyboard's real height, frame by frame on the UI thread, so the composer rides
  // on top of it. Closed, the content clears the system navigation bar instead.
  const keyboard = useReanimatedKeyboardAnimation();
  const bottomInset = insets.bottom;
  const keyboardSpace = useAnimatedStyle(() => ({
    paddingBottom: Math.max(-keyboard.height.get(), bottomInset),
  }));

  return (
    <>
      <Stack.Screen options={{ title: note?.title ?? '' }} />
      <Animated.View style={[{ flex: 1, backgroundColor: palette.surface }, keyboardSpace]}>
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
      </Animated.View>
    </>
  );
}
