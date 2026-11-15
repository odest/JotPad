import { Box } from '@expo/ui/jetpack-compose';
import { background, clip, Shapes, size as sizeModifier } from '@expo/ui/jetpack-compose/modifiers';
import { StyleSheet, View } from 'react-native';

import { NativeHost } from '@/components/native-host';
import { resolveColor, usePalette } from '@/theme';

import { type BadgeShape } from './badge-shapes';
import { type ShapedBadgeProps } from './shaped-badge';

const MATERIAL_SHAPES = {
  circle: Shapes.Circle,
  cookie4: Shapes.Material.Cookie4Sided,
  cookie6: Shapes.Material.Cookie6Sided,
  cookie9: Shapes.Material.Cookie9Sided,
  clover4: Shapes.Material.Clover4Leaf,
  sunny: Shapes.Material.Sunny,
  'soft-burst': Shapes.Material.SoftBurst,
  puffy: Shapes.Material.Puffy,
  pentagon: Shapes.Material.Pentagon,
  arch: Shapes.Material.Arch,
} satisfies Record<BadgeShape, unknown>;

/** A Material 3 Expressive shape drawn by Compose, with React Native content on top. */
export function ShapedBadge({ shape, size, color, children }: ShapedBadgeProps) {
  const palette = usePalette();
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <NativeHost style={StyleSheet.absoluteFill} pointerEvents="none">
        <Box
          modifiers={[
            sizeModifier(size, size),
            clip(MATERIAL_SHAPES[shape]),
            background(resolveColor(palette, color)),
          ]}
        />
      </NativeHost>
      {children}
    </View>
  );
}
