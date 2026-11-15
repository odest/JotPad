import { getLocales } from 'expo-localization';
import { useSyncExternalStore } from 'react';

import { languageSetting, type LanguageSetting } from '@/data/preferences';

import { en, type Strings } from './en';
import { tr } from './tr';

export type { Strings };

const LANGUAGES = { en, tr } satisfies Record<string, Strings>;

type Language = keyof typeof LANGUAGES;

function isLanguage(code: string | null): code is Language {
  return code !== null && code in LANGUAGES;
}

/** The language for a setting, with a locale for dates: the device's when it matches. */
function resolve(setting: LanguageSetting): { language: Language; locale: string } {
  const locales = getLocales();
  if (setting === 'system') {
    for (const { languageCode, languageTag } of locales) {
      if (isLanguage(languageCode)) return { language: languageCode, locale: languageTag };
    }
    return { language: 'en', locale: 'en-US' };
  }
  const device = locales.find((candidate) => candidate.languageCode === setting);
  return { language: setting, locale: device?.languageTag ?? setting };
}

let current = resolve(languageSetting.get());
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * The UI strings in the chosen language: the device language by default, English when
 * the app does not have it. Components re-render when the language changes, so read
 * strings through this hook while rendering and pass them to helpers that need them.
 */
export function useT(): Strings {
  return useSyncExternalStore(subscribe, () => LANGUAGES[current.language]);
}

/** The locale that matches `useT`, for formatting dates and times. */
export function useLocale(): string {
  return useSyncExternalStore(subscribe, () => current.locale);
}

/** The current strings, for code that runs on an event rather than while rendering. */
export function strings(): Strings {
  return LANGUAGES[current.language];
}

export function setLanguage(setting: LanguageSetting) {
  languageSetting.set(setting);
  current = resolve(setting);
  listeners.forEach((listener) => listener());
}
