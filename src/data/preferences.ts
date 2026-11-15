import Storage from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

/**
 * A small setting kept in the key-value store. It is read once, synchronously, so the
 * first frame already uses the saved value; an unknown stored value falls back.
 */
function createPreference<T extends string>(key: string, values: readonly T[], fallback: T) {
  const stored = Storage.getItemSync(key);
  let value = values.find((candidate) => candidate === stored) ?? fallback;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get: () => value,
    useValue: () => useSyncExternalStore(subscribe, () => value),
    set: (next: T) => {
      Storage.setItemSync(key, next);
      value = next;
      listeners.forEach((listener) => listener());
    },
  };
}

/** How the notes list is ordered. Pinned notes stay on top in every order. */
export type NoteSort = 'activity' | 'newest' | 'oldest' | 'title-asc' | 'title-desc';

const noteSort = createPreference<NoteSort>(
  'notes.sort',
  ['activity', 'newest', 'oldest', 'title-asc', 'title-desc'],
  'activity',
);

export const useNoteSort = noteSort.useValue;
export const setNoteSort = noteSort.set;

/** The app's color scheme; `system` follows the device setting. */
export type ThemeMode = 'system' | 'light' | 'dark';

const themeMode = createPreference<ThemeMode>('theme', ['system', 'light', 'dark'], 'system');

export const useThemeMode = themeMode.useValue;

function applyThemeMode(mode: ThemeMode) {
  // "unspecified" hands the choice back to the system setting.
  Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
}

export function setThemeMode(mode: ThemeMode) {
  themeMode.set(mode);
  applyThemeMode(mode);
}

/** Applies the saved theme. Call it before the first render so nothing flashes. */
export function applySavedTheme() {
  applyThemeMode(themeMode.get());
}
