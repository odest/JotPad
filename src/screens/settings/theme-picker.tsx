import Check from '@expo/material-symbols/check.xml';
import { Icon, ListItem } from '@expo/ui';

import { usePalette } from '@/theme';

import { THEMES, type ThemeMode } from './themes';

export type ThemePickerProps = {
  theme: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

/**
 * The theme choice inside the Theme section. iOS lists the options with a checkmark;
 * Android uses a Material 3 Expressive button group (theme-picker.android.tsx).
 */
export function ThemePicker({ theme, onChange }: ThemePickerProps) {
  const palette = usePalette();
  return (
    <>
      {THEMES.map(({ mode, label }) => (
        <ListItem
          key={mode}
          onPress={() => onChange(mode)}
          trailing={
            theme === mode ? (
              <Icon name={{ ios: 'checkmark', android: Check }} color={palette.primary} />
            ) : undefined
          }
        >
          {label}
        </ListItem>
      ))}
    </>
  );
}
