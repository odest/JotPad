import { Pressable, Text } from 'react-native';

import { usePalette } from '@/theme';

/** Filled primary button: a Material filled button on Android, a tinted capsule on iOS. */
export function Button({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const palette = usePalette();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: palette['on-primary'], foreground: true }}
      className={`h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-6 ios:active:opacity-70 ${disabled ? 'opacity-40' : ''}`}
    >
      <Text className="text-headline font-medium text-on-primary ios:font-semibold">{title}</Text>
    </Pressable>
  );
}
