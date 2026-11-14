import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import { type SFSymbol } from 'sf-symbols-typescript';

import { usePalette, type ColorRole } from '@/theme';

export type IconName = { ios: SFSymbol; android: AndroidSymbol };

/** One icon, drawn with SF Symbols on iOS and Material Symbols on Android. */
export function Icon({
  name,
  size = 24,
  color = 'on-surface',
}: {
  name: IconName;
  size?: number;
  color?: ColorRole;
}) {
  const palette = usePalette();
  return <SymbolView name={name} size={size} tintColor={palette[color]} />;
}
