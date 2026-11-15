import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ShapedBadge } from '@/components/shaped-badge';
import { type Entry } from '@/data/notes-store';
import { usePalette } from '@/theme';
import { useT } from '@/i18n';

/**
 * The pinned messages of a note, one at a time, below the header. Tapping it jumps to
 * the message shown and moves on to the next one, as in messaging apps. Android shows it
 * as a rounded tonal card with an Expressive pin badge; iOS as a full-width bar.
 */
export function PinnedBar({
  pinned,
  index,
  onPress,
}: {
  /** Most recently pinned first. */
  pinned: Entry[];
  index: number;
  onPress: (entry: Entry) => void;
}) {
  const t = useT();
  const palette = usePalette();
  const entry = pinned[index];
  if (!entry) return null;

  const label =
    pinned.length > 1
      ? t.note.pinnedMessagePosition(index + 1, pinned.length)
      : t.note.pinnedMessage;

  return (
    <Pressable
      onPress={() => onPress(entry)}
      android_ripple={{ color: palette['surface-container-highest'] }}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${entry.body}`}
      accessibilityHint={t.note.pinnedMessageHint}
      className="ios:active:bg-surface-container-high ios:border-b ios:border-outline-variant android:mx-3 android:mb-1 android:overflow-hidden android:rounded-xl android:bg-surface-container-high android:pr-2 min-h-14 flex-row items-center gap-3 bg-surface-container px-4 py-2"
    >
      {/* One segment per pinned message; the one shown is filled. */}
      <View className="gap-0.5 self-stretch py-1">
        {pinned.map((p, i) => (
          <View
            key={p.id}
            className={`w-0.5 flex-1 rounded-full ${i === index ? 'bg-primary' : 'bg-outline-variant'}`}
          />
        ))}
      </View>
      <View className="flex-1">
        <Text className="text-footnote font-medium text-primary">{label}</Text>
        <Text numberOfLines={1} className="text-subhead text-on-surface">
          {entry.body}
        </Text>
      </View>
      {process.env.EXPO_OS === 'android' ? (
        <ShapedBadge shape="cookie4" size={40} color="secondary-container">
          <Icon
            name={{ ios: 'pin.fill', android: 'keep' }}
            size={20}
            color="on-secondary-container"
          />
        </ShapedBadge>
      ) : (
        <Icon name={{ ios: 'pin.fill', android: 'keep' }} size={20} color="on-surface-variant" />
      )}
    </Pressable>
  );
}
