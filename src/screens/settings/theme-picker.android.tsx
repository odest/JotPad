import { Row, Text, ToggleButton } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, padding, weight } from '@expo/ui/jetpack-compose/modifiers';

import { usePalette } from '@/theme';

import { type ThemePickerProps } from './theme-picker';
import { THEMES } from './themes';

/**
 * A Material 3 Expressive button group: the chosen button changes shape, and the
 * buttons sit close together so they read as one control.
 */
export function ThemePicker({ theme, onChange }: ThemePickerProps) {
  const palette = usePalette();
  return (
    <Row
      horizontalArrangement={{ spacedBy: 2 }}
      modifiers={[fillMaxWidth(), padding(16, 8, 16, 8)]}
    >
      {THEMES.map(({ mode, short }) => (
        <ToggleButton
          key={mode}
          checked={theme === mode}
          onCheckedChange={() => onChange(mode)}
          modifiers={[weight(1)]}
          colors={{
            containerColor: palette['surface-container-highest'],
            contentColor: palette['on-surface'],
            checkedContainerColor: palette.primary,
            checkedContentColor: palette['on-primary'],
          }}
        >
          <Text>{short}</Text>
        </ToggleButton>
      ))}
    </Row>
  );
}
