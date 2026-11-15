import { type ReactNode } from 'react';
import { View } from 'react-native';

import { resolveColor, usePalette, type ColorValue } from '@/theme';

import { type BadgeShape } from './badge-shapes';

export type ShapedBadgeProps = {
  /** Used on Android only; iOS draws a circle. */
  shape: BadgeShape;
  size: number;
  color: ColorValue;
  /** Centered on top of the shape. */
  children?: ReactNode;
};

/**
 * A filled shape with content on top. Expressive shapes are a Material pattern, so iOS
 * draws the system's plain circle (shaped-badge.android.tsx has the shapes).
 */
export function ShapedBadge({ size, color, children }: ShapedBadgeProps) {
  const palette = usePalette();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: resolveColor(palette, color),
      }}
      className="items-center justify-center"
    >
      {children}
    </View>
  );
}
