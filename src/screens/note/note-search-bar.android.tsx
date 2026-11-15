import { type NativeStackNavigationOptions } from 'expo-router';
import { useEffect, useRef, type ComponentRef } from 'react';
import { BackHandler, Keyboard, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { typeRamp, usePalette } from '@/theme';

import { type NoteSearchBarProps } from './note-search-bar';

/** Header options for search mode: the stack header steps aside for the search bar. */
export function searchHeaderOptions(_props: NoteSearchBarProps): NativeStackNavigationOptions {
  return { headerShown: false };
}

/**
 * The top app bar in search mode, as in Material messaging apps: back, a search field
 * and clear. Back, on screen or the system gesture, leaves search.
 */
export function NoteSearchBar({ query, onChangeQuery, onClose }: NoteSearchBarProps) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();

  // Search opens from the header menu. Focus once that menu has closed; focusing while it
  // is still on screen leaves the keyboard hidden on Android.
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  useEffect(() => {
    // The menu's window takes a moment to hand focus back, so try again until the
    // keyboard is up instead of waiting a fixed, worst-case time.
    const timers = [300, 700, 1200].map((delay) =>
      setTimeout(() => {
        if (Keyboard.isVisible()) return;
        input.current?.blur();
        input.current?.focus();
      }, delay),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [onClose]);

  return (
    <View
      className="flex-row items-center gap-1 bg-surface px-1"
      style={{ paddingTop: insets.top, minHeight: insets.top + 64 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close search"
        onPress={onClose}
        android_ripple={{ color: palette['surface-container-highest'], borderless: true }}
        className="h-12 w-12 items-center justify-center"
      >
        <Icon name={{ ios: 'chevron.left', android: 'arrow_back' }} />
      </Pressable>
      <TextInput
        ref={input}
        value={query}
        onChangeText={onChangeQuery}
        placeholder="Search in note"
        placeholderTextColor={palette['on-surface-variant']}
        cursorColor={palette.primary}
        selectionColor={palette.primary}
        autoCapitalize="none"
        returnKeyType="search"
        style={{ fontSize: typeRamp.title.size }}
        className="flex-1 text-on-surface"
      />
      {query.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeQuery('')}
          android_ripple={{ color: palette['surface-container-highest'], borderless: true }}
          className="h-12 w-12 items-center justify-center"
        >
          <Icon name={{ ios: 'xmark', android: 'close' }} color="on-surface-variant" />
        </Pressable>
      )}
    </View>
  );
}
