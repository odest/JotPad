import { type ThemeMode } from '@/data/preferences';
import { t } from '@/i18n';

export type { ThemeMode };

export const THEMES: { mode: ThemeMode; label: string; short: string }[] = [
  { mode: 'system', label: t.settings.themeSystem, short: t.settings.themeSystemShort },
  { mode: 'light', label: t.settings.themeLight, short: t.settings.themeLight },
  { mode: 'dark', label: t.settings.themeDark, short: t.settings.themeDark },
];
