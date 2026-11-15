import { type NativeStackNavigationOptions } from 'expo-router';

export type NoteSearchBarProps = {
  query: string;
  onChangeQuery: (query: string) => void;
  onClose: () => void;
};

/**
 * Header options for search mode. The screen merges them into its own `Stack.Screen`, so
 * leaving search restores the normal header. iOS uses the system search bar in the header.
 */
export function searchHeaderOptions({
  onChangeQuery,
  onClose,
}: NoteSearchBarProps): NativeStackNavigationOptions {
  return {
    headerSearchBarOptions: {
      placeholder: 'Search in note',
      autoCapitalize: 'none',
      autoFocus: true,
      hideWhenScrolling: false,
      onChangeText: (event) => onChangeQuery(event.nativeEvent.text),
      onCancelButtonPress: onClose,
    },
  };
}

/** The search field drawn in the screen itself. iOS has it in the header instead. */
export function NoteSearchBar(_props: NoteSearchBarProps) {
  return null;
}
