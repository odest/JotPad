import { Color } from 'expo-router';

export type ColorScheme = 'light' | 'dark';

export type ColorRole =
  | 'surface'
  | 'surface-container-low'
  | 'surface-container'
  | 'surface-container-high'
  | 'surface-container-highest'
  | 'on-surface'
  | 'on-surface-variant'
  | 'outline'
  | 'outline-variant'
  | 'primary'
  | 'on-primary'
  | 'primary-container'
  | 'on-primary-container'
  | 'secondary-container'
  | 'on-secondary-container'
  | 'error'
  | 'on-error';

export type Palette = Record<ColorRole, string>;

/**
 * iOS system colors (UIKit semantic colors), expressed in the shared role vocabulary.
 * `primary-container` is the tint itself: iOS fills prominent surfaces with the tint
 * color instead of a tonal container.
 */
const ios: Record<ColorScheme, Palette> = {
  light: {
    surface: '#FFFFFF',
    'surface-container-low': '#F2F2F7',
    'surface-container': '#F2F2F7',
    'surface-container-high': '#E5E5EA',
    'surface-container-highest': '#D1D1D6',
    'on-surface': '#000000',
    'on-surface-variant': '#3C3C4399',
    outline: '#8E8E93',
    'outline-variant': '#3C3C434A',
    primary: '#007AFF',
    'on-primary': '#FFFFFF',
    'primary-container': '#007AFF',
    'on-primary-container': '#FFFFFF',
    'secondary-container': '#E9E9EB',
    'on-secondary-container': '#000000',
    error: '#FF3B30',
    'on-error': '#FFFFFF',
  },
  dark: {
    surface: '#000000',
    'surface-container-low': '#1C1C1E',
    'surface-container': '#1C1C1E',
    'surface-container-high': '#2C2C2E',
    'surface-container-highest': '#3A3A3C',
    'on-surface': '#FFFFFF',
    'on-surface-variant': '#EBEBF599',
    outline: '#8E8E93',
    'outline-variant': '#54545899',
    primary: '#0A84FF',
    'on-primary': '#FFFFFF',
    'primary-container': '#0A84FF',
    'on-primary-container': '#FFFFFF',
    'secondary-container': '#262629',
    'on-secondary-container': '#FFFFFF',
    error: '#FF453A',
    'on-error': '#FFFFFF',
  },
};

/**
 * Material 3 dynamic colors: they follow the wallpaper on Android 12+ and fall back to
 * the baseline Material palette on older versions. They are resolved for the color
 * scheme that is active at call time, so call this during render.
 */
function androidPalette(): Palette {
  const m3 = Color.android.dynamic;
  return {
    surface: m3.surface,
    'surface-container-low': m3.surfaceContainerLow,
    'surface-container': m3.surfaceContainer,
    'surface-container-high': m3.surfaceContainerHigh,
    'surface-container-highest': m3.surfaceContainerHighest,
    'on-surface': m3.onSurface,
    'on-surface-variant': m3.onSurfaceVariant,
    outline: m3.outline,
    'outline-variant': m3.outlineVariant,
    primary: m3.primary,
    'on-primary': m3.onPrimary,
    'primary-container': m3.primaryContainer,
    'on-primary-container': m3.onPrimaryContainer,
    'secondary-container': m3.secondaryContainer,
    'on-secondary-container': m3.onSecondaryContainer,
    error: m3.error,
    'on-error': m3.onError,
  } as unknown as Palette;
}

export function getPalette(scheme: ColorScheme): Palette {
  return process.env.EXPO_OS === 'android' ? androidPalette() : ios[scheme];
}
