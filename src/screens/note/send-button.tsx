import { Pressable } from 'react-native';

import { Icon } from '@/components/icon';
import { usePalette } from '@/theme';
import { t } from '@/i18n';

export type SendButtonProps = {
  /** Shows a check mark instead of the send icon. */
  isEditing: boolean;
  enabled: boolean;
  onPress: () => void;
};

/**
 * The composer's send button: a tinted circle on iOS. Android morphs it into a Material 3
 * Expressive shape once there is something to send (send-button.android.tsx).
 */
export function SendButton({ isEditing, enabled, onPress }: SendButtonProps) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isEditing ? t.common.save : t.note.send}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={onPress}
      android_ripple={{ color: palette['on-primary'], foreground: true }}
      className={`ios:active:opacity-70 h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary ${enabled ? '' : 'opacity-40'}`}
    >
      <Icon
        name={
          isEditing ? { ios: 'checkmark', android: 'check' } : { ios: 'arrow.up', android: 'send' }
        }
        size={22}
        color="on-primary"
      />
    </Pressable>
  );
}
