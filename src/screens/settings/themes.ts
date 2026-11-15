export type ThemeMode = 'system' | 'light' | 'dark';

export const THEMES: { mode: ThemeMode; label: string; short: string }[] = [
  { mode: 'system', label: 'System default', short: 'System' },
  { mode: 'light', label: 'Light', short: 'Light' },
  { mode: 'dark', label: 'Dark', short: 'Dark' },
];
