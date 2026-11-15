import { type LanguageSetting, type ThemeMode } from '@/data/preferences';
import { type Strings } from '@/i18n';

/** An option in a settings picker: the full label for lists, a short one for buttons. */
export type Choice<T extends string> = { value: T; label: string; short: string };

// They take the strings from `useT()`, so the labels follow a change of language.

export function themeChoices(t: Strings): Choice<ThemeMode>[] {
  return [
    { value: 'system', label: t.settings.themeSystem, short: t.settings.themeSystemShort },
    { value: 'light', label: t.settings.themeLight, short: t.settings.themeLight },
    { value: 'dark', label: t.settings.themeDark, short: t.settings.themeDark },
  ];
}

export function languageChoices(t: Strings): Choice<LanguageSetting>[] {
  return [
    {
      value: 'system',
      label: t.settings.languageSystem,
      short: t.settings.languageSystemShort,
    },
    // Each language is named in itself, so it can be found from any language.
    { value: 'tr', label: 'Türkçe', short: 'Türkçe' },
    { value: 'en', label: 'English', short: 'English' },
  ];
}
