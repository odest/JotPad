import { useState } from 'react';
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

/** Splits `body` around each case-insensitive occurrence of `query`. */
function splitMatches(body: string, query: string): { text: string; match: boolean }[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [{ text: body, match: false }];
  const haystack = body.toLocaleLowerCase();
  const parts: { text: string; match: boolean }[] = [];
  let from = 0;
  for (let at = haystack.indexOf(needle); at !== -1; at = haystack.indexOf(needle, from)) {
    if (at > from) parts.push({ text: body.slice(from, at), match: false });
    parts.push({ text: body.slice(at, at + needle.length), match: true });
    from = at + needle.length;
  }
  if (from < body.length) parts.push({ text: body.slice(from), match: false });
  return parts;
}

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
            onLongPress={() => onLongPress(entry)}
            className={`rounded-xl bg-primary-container px-4 py-2 ${corners}`}
          >
            <Text className="text-body text-on-primary-container">
              {splitMatches(entry.body, query).map((part, i) =>
                part.match ? (
                  <Text
                    key={i}
                    style={{ backgroundColor: palette.primary, color: palette['on-primary'] }}
                  >
                    {part.text}
                  </Text>
                ) : (
                  part.text
                ),
              )}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
      {!joinsNext && (
        <Text className="self-end pr-1 pt-1 text-caption text-on-surface-variant">
          {formatTime(entry.createdAt)}
        </Text>
      )}
    </View>
  );
}
