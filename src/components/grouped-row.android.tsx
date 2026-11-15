import { Text, View } from 'react-native';

import { usePalette } from '@/theme';

import { type GroupedRowProps } from './grouped-row';

const OUTER = 20;
const INNER = 4;

/**
 * Material 3 Expressive grouped list: the rows of a group are separate cards with a
 * small gap, rounded strongly on the group's outside and slightly between rows.
 */
export function GroupedRow({ position, label, children }: GroupedRowProps) {
  const palette = usePalette();
  const top = position === 'only' || position === 'first' ? OUTER : INNER;
  const bottom = position === 'only' || position === 'last' ? OUTER : INNER;

  return (
    <View className={position === 'only' || position === 'last' ? 'pb-4' : 'pb-0.5'}>
      {label && <Text className="px-8 pb-2 text-subhead font-medium text-primary">{label}</Text>}
      <View
        style={{
          marginHorizontal: 16,
          overflow: 'hidden',
          backgroundColor: palette['surface-container'],
          borderTopLeftRadius: top,
          borderTopRightRadius: top,
          borderBottomLeftRadius: bottom,
          borderBottomRightRadius: bottom,
        }}
      >
        {children}
      </View>
    </View>
  );
}
