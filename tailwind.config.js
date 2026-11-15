/**
 * Design tokens. Color and type values are CSS variables that the ThemeProvider
 * (src/theme/theme-provider.tsx) fills in per platform and color scheme, so one
 * class name resolves to Material 3 values on Android and to iOS system values on iOS.
 */
const { hairlineWidth } = require('nativewind/theme');

const colorRoles = [
  'surface',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
  'on-surface',
  'on-surface-variant',
  'outline',
  'outline-variant',
  'primary',
  'on-primary',
  'primary-container',
  'on-primary-container',
  'secondary-container',
  'on-secondary-container',
  'tertiary-container',
  'on-tertiary-container',
  'error',
  'on-error',
];

const textStyles = ['title', 'headline', 'body', 'subhead', 'footnote', 'caption'];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: {
      transparent: 'transparent',
      ...Object.fromEntries(colorRoles.map((role) => [role, `var(--color-${role})`])),
    },
    fontSize: Object.fromEntries(
      textStyles.map((style) => [
        style,
        [`var(--text-${style})`, { lineHeight: `var(--leading-${style})` }],
      ]),
    ),
    spacing: {
      0: '0px',
      px: '1px',
      0.5: '2px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      14: '56px',
      16: '64px',
    },
    borderWidth: {
      0: '0px',
      hairline: hairlineWidth(),
    },
    borderRadius: {
      none: '0px',
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '28px',
      full: '9999px',
    },
  },
  plugins: [],
};
