import { Pressable, Text, View } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { type Entry } from '@/data/notes-store';
import { usePalette } from '@/theme';
import { formatDay, formatTime } from '@/utils/format-time';

export type EntryItem = {
  entry: Entry;
  /** First entry of its calendar day: a day heading is shown above it. */
  startsDay: boolean;
  /** Entries sent close together read as one group. */
  joinsPrevious: boolean;
  joinsNext: boolean;
};

const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

export function EntryBubble({
  item,
  highlighted,
  onLongPress,
}: {
  item: EntryItem;
  /** Briefly true after a jump to this entry, so the eye finds it. */
  highlighted: boolean;
  onLongPress: (entry: Entry) => void;
}) {
  const { entry, startsDay, joinsPrevious, joinsNext } = item;
  const palette = usePalette();

  // Android shapes a group like Google Messages: the corners between grouped bubbles
  // tighten. iOS keeps every bubble fully rounded and only closes the gap.
  const corners = [
    joinsPrevious ? 'android:rounded-tr-xs' : '',
    joinsNext ? 'android:rounded-br-xs' : '',
  ].join(' ');

  return (
    <View className={joinsPrevious && !startsDay ? 'pt-0.5' : 'pt-3'}>
      {/* Full-width tint behind the row, faded in and out after a jump. */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          // The list pads rows by 12; the tint spans the full width.
          left: -12,
          right: -12,
          backgroundColor: palette.primary,
          opacity: highlighted ? 0.16 : 0,
          transitionProperty: 'opacity',
          transitionDuration: highlighted ? 150 : 600,
          transitionTimingFunction: EASE_OUT,
        }}
      />
      {startsDay && (
        <Text className="pb-3 text-center text-footnote font-medium text-on-surface-variant">
          {formatDay(entry.createdAt)}
        </Text>
      )}
      <View className="gap-1.5 flex-row items-center justify-end">
        {entry.pinnedAt !== null && (
          <Icon name={{ ios: 'pin.fill', android: 'keep' }} size={14} color="on-surface-variant" />
        )}
        <Pressable
          onLongPress={() => onLongPress(entry)}
          className={`max-w-[80%] rounded-xl bg-primary-container px-4 py-2 active:opacity-80 ${corners}`}
        >
          <Text className="text-body text-on-primary-container">{entry.body}</Text>
        </Pressable>
      </View>
      {!joinsNext && (
        <Text className="self-end pr-1 pt-1 text-caption text-on-surface-variant">
          {formatTime(entry.createdAt)}
        </Text>
      )}
    </View>
  );
}
