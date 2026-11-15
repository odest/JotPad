import { Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { usePalette } from '@/theme';
import { useT } from '@/i18n';

/**
 * Takes the composer's place while searching: how many messages match, and arrows that
 * step to the older or newer match.
 */
export function SearchNav({
  query,
  count,
  index,
  onOlder,
  onNewer,
}: {
  query: string;
  count: number;
  /** Position of the current match, oldest first. */
  index: number;
  onOlder: () => void;
  onNewer: () => void;
}) {
  const t = useT();
  const label = !query.trim()
    ? t.note.typeToSearch
    : count === 0
      ? t.note.noMatches
      : t.note.matchPosition(index + 1, count);

  return (
    <View className="ios:border-t ios:border-outline-variant min-h-16 flex-row items-center bg-surface-container pl-5 pr-2">
      <Text
        accessibilityLiveRegion="polite"
        className="flex-1 text-subhead text-on-surface-variant"
      >
        {label}
      </Text>
      <NavButton
        icon={{ ios: 'chevron.up', android: 'keyboard_arrow_up' }}
        label={t.note.olderMatch}
        disabled={count === 0 || index === 0}
        onPress={onOlder}
      />
      <NavButton
        icon={{ ios: 'chevron.down', android: 'keyboard_arrow_down' }}
        label={t.note.newerMatch}
        disabled={count === 0 || index === count - 1}
        onPress={onNewer}
      />
    </View>
  );
}

function NavButton({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: IconName;
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: palette['surface-container-highest'], borderless: true }}
      className={`ios:active:opacity-60 h-12 w-12 items-center justify-center ${disabled ? 'opacity-40' : ''}`}
    >
      <Icon name={icon} color="on-surface" />
    </Pressable>
  );
}
