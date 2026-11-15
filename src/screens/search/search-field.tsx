import { Pressable, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { typeRamp, usePalette } from '@/theme';

/**
 * Always-visible search bar in the Material 3 shape. Used on Android, where the stack
 * header can only offer search behind an icon; iOS uses the header's own search bar.
 */
export function SearchField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  const palette = usePalette();

  return (
    <View className="h-14 flex-row items-center gap-3 rounded-full bg-surface-container-high pl-4 pr-1">
      <Icon name={{ ios: 'magnifyingglass', android: 'search' }} color="on-surface-variant" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette['on-surface-variant']}
        cursorColor={palette.primary}
        selectionColor={palette.primary}
        autoCapitalize="none"
        returnKeyType="search"
        style={{ fontSize: typeRamp.body.size }}
        className="flex-1 text-on-surface"
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeText('')}
          android_ripple={{ color: palette['surface-container-highest'], borderless: true }}
          className="h-12 w-12 items-center justify-center"
        >
          <Icon name={{ ios: 'xmark', android: 'close' }} color="on-surface-variant" />
        </Pressable>
      )}
    </View>
  );
}
