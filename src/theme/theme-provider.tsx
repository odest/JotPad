import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { vars } from 'nativewind';
import { type ReactNode } from 'react';
import { useColorScheme, View } from 'react-native';

import { getPalette, type ColorScheme, type Palette } from './colors';
import { typeRamp } from './typography';

function toCssVariables(palette: Palette) {
  const variables: Record<string, string | number> = {};
  for (const [role, value] of Object.entries(palette)) {
    variables[`--color-${role}`] = value;
  }
  for (const [name, { size, leading }] of Object.entries(typeRamp)) {
    variables[`--text-${name}`] = size;
    variables[`--leading-${name}`] = leading;
  }
  return vars(variables);
}

/**
 * Publishes the design tokens as CSS variables for NativeWind classes and keeps the
 * navigation chrome (headers, tab bar) on the same palette.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const palette = usePalette();
  const base = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: palette.primary,
          background: palette.surface,
          card: palette.surface,
          text: palette['on-surface'],
          border: palette['outline-variant'],
          notification: palette.error,
        },
      }}
    >
      <View style={[{ flex: 1 }, toCssVariables(palette)]}>{children}</View>
    </NavigationThemeProvider>
  );
}

/** Raw palette for the few places that cannot take a class name (native props). */
export function usePalette(): Palette {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return getPalette(scheme);
}
