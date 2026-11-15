import { Text, View } from 'react-native';

import { type Entry } from '@/data/notes-store';
import { formatDay, formatTime } from '@/utils/format-time';

export type EntryItem = {
  entry: Entry;
  /** First entry of its calendar day: a day heading is shown above it. */
  startsDay: boolean;
  /** Entries sent close together read as one group. */
  joinsPrevious: boolean;
  joinsNext: boolean;
};

export function EntryBubble({ item }: { item: EntryItem }) {
  const { entry, startsDay, joinsPrevious, joinsNext } = item;

  // Android shapes a group like Google Messages: the corners between grouped bubbles
  // tighten. iOS keeps every bubble fully rounded and only closes the gap.
  const corners = [
    joinsPrevious ? 'android:rounded-tr-xs' : '',
    joinsNext ? 'android:rounded-br-xs' : '',
  ].join(' ');

  return (
    <View className={joinsPrevious && !startsDay ? 'pt-0.5' : 'pt-3'}>
      {startsDay && (
        <Text className="pb-3 text-center text-footnote font-medium text-on-surface-variant">
          {formatDay(entry.createdAt)}
        </Text>
      )}
      <View
        className={`max-w-[80%] self-end rounded-xl bg-primary-container px-4 py-2 ${corners}`}
      >
        <Text className="text-body text-on-primary-container">{entry.body}</Text>
      </View>
      {!joinsNext && (
        <Text className="self-end pr-1 pt-1 text-caption text-on-surface-variant">
          {formatTime(entry.createdAt)}
        </Text>
      )}
    </View>
  );
}
