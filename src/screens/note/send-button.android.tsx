import { Pressable, StyleSheet } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { ShapedBadge } from '@/components/shaped-badge';

import { type SendButtonProps } from './send-button';
import { t } from '@/i18n';

const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);
const SIZE = 48;

/**
 * Material 3 Expressive send button: a quiet circle while the field is empty, a primary
 * cookie shape that turns into place once there is something to send.
 */
export function SendButton({ isEditing, enabled, onPress }: SendButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isEditing ? t.common.save : t.note.send}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={onPress}
      style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Only the shape turns; the icon stays upright on top of it. */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ rotate: enabled ? '60deg' : '0deg' }, { scale: enabled ? 1 : 0.9 }],
            transitionProperty: 'transform',
            transitionDuration: 350,
            transitionTimingFunction: EASE_OUT,
          },
        ]}
      >
        <ShapedBadge
          shape={enabled ? 'cookie9' : 'circle'}
          size={SIZE}
          color={enabled ? 'primary' : 'surface-container-highest'}
        />
      </Animated.View>
      <Icon
        name={
          isEditing ? { ios: 'checkmark', android: 'check' } : { ios: 'arrow.up', android: 'send' }
        }
        size={22}
        color={enabled ? 'on-primary' : 'on-surface-variant'}
      />
    </Pressable>
  );
}
