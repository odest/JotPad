import { getLocales } from 'expo-localization';

import { en, type Strings } from './en';
import { tr } from './tr';

const LANGUAGES = { en, tr } satisfies Record<string, Strings>;

type Language = keyof typeof LANGUAGES;

function isLanguage(code: string | null): code is Language {
  return code !== null && code in LANGUAGES;
}

/** The first preferred device language the app has, with its locale; English otherwise. */
function deviceLanguage(): { language: Language; locale: string } {
  for (const { languageCode, languageTag } of getLocales()) {
    if (isLanguage(languageCode)) return { language: languageCode, locale: languageTag };
  }
  return { language: 'en', locale: 'en-US' };
}

const device = deviceLanguage();

/**
 * The UI strings in the device language, falling back to English. The language is read
 * once at startup; a change in the system settings applies from the next launch.
 */
export const t: Strings = LANGUAGES[device.language];

/** The locale that matches `t`, for formatting dates and times. */
export const locale = device.locale;
