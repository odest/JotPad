import Check from '@expo/material-symbols/check.xml';
import { FieldGroup, Icon, ListItem } from '@expo/ui';
import { useState } from 'react';
import { Appearance, View } from 'react-native';

import { NativeHost } from '@/components/native-host';
import { usePalette } from '@/theme';

type ThemeMode = 'system' | 'light' | 'dark';

const THEMES: { mode: ThemeMode; label: string }[] = [
  { mode: 'system', label: 'System default' },
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
];

/**
 * Settings are the platform's own grouped form (@expo/ui): Material list items on
 * Android, an inset grouped list on iOS.
 */
export function Settings() {
  const palette = usePalette();
  const [theme, setTheme] = useState<ThemeMode>('system');

  const applyTheme = (mode: ThemeMode) => {
    setTheme(mode);
    // "unspecified" hands the choice back to the system setting.
    Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.surface }}>
      <NativeHost style={{ flex: 1 }}>
        <FieldGroup>
          <FieldGroup.Section title="Theme">
            {THEMES.map(({ mode, label }) => (
              <ListItem
                key={mode}
                onPress={() => applyTheme(mode)}
                trailing={
                  theme === mode ? (
                    <Icon name={{ ios: 'checkmark', android: Check }} color={palette.primary} />
                  ) : undefined
                }
              >
                {label}
              </ListItem>
            ))}
          </FieldGroup.Section>
        </FieldGroup>
      </NativeHost>
    </View>
  );
}
