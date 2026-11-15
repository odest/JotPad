import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { type Entry } from '@/data/notes-store';
import { usePalette } from '@/theme';
import { useLocale, useT } from '@/i18n';
import { formatDay, formatTime } from '@/utils/format-time';
import { longPressFeedback } from '@/utils/haptics';

import { MessageBody } from './message-body';

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
  query = '',
  onLongPress,
}: {
  item: EntryItem;
  /** True after a jump to this entry, so the eye finds it. */
  highlighted: boolean;
  /** Search text to mark inside the message. */
  query?: string;
  onLongPress: (entry: Entry) => void;
}) {
  const t = useT();
  const openActions = () => {
    longPressFeedback();
    onLongPress(entry);
  };
  const locale = useLocale();
  const { entry, startsDay, joinsPrevious, joinsNext } = item;
  const palette = usePalette();
  const [pressed, setPressed] = useState(false);

  // Android shapes a group like Google Messages: the corners between grouped bubbles
  // tighten. iOS keeps every bubble fully rounded and only closes the gap.
  const corners = [
    joinsPrevious ? 'android:rounded-tr-xs' : '',
    joinsNext ? 'android:rounded-br-xs' : '',
  ].join(' ');

  return (
    <View className={joinsPrevious && !startsDay ? 'pt-0.5' : 'pt-3'}>
      {startsDay && (
        <View className="items-center pb-3">
          {/* Android sets the day on a tonal pill, as Material chat apps do. */}
          <Text className="android:rounded-full android:bg-surface-container-high android:px-3 android:py-1 text-center text-footnote font-medium text-on-surface-variant">
            {formatDay(entry.createdAt, { t, locale })}
          </Text>
        </View>
      )}
      <View>
        {/* Full-width tint behind the message (not its day heading), faded in and out. */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            // A little room around the bubble and its time, without reaching the neighbors.
            top: -4,
            bottom: -4,
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
        <View className="gap-1.5 flex-row items-center justify-end">
          {entry.pinnedAt !== null && (
            <Icon
              name={{ ios: 'pin.fill', android: 'keep' }}
              size={14}
              color="on-surface-variant"
            />
          )}
          {/* Sinks a little under the finger, so a long press feels like holding the bubble. */}
          <Animated.View
            style={{
              maxWidth: '80%',
              transform: [{ scale: pressed ? 0.96 : 1 }],
              transitionProperty: 'transform',
              transitionDuration: pressed ? 120 : 250,
              transitionTimingFunction: EASE_OUT,
            }}
          >
            <Pressable
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              onLongPress={openActions}
              className={`rounded-xl bg-primary-container px-4 py-2 ${corners}`}
            >
              <MessageBody body={entry.body} query={query} onLongPress={openActions} />
            </Pressable>
          </Animated.View>
        </View>
        {!joinsNext && (
          <Text className="self-end pr-1 pt-1 text-caption text-on-surface-variant">
            {formatTime(entry.createdAt, locale)}
          </Text>
        )}
      </View>
    </View>
  );
}
