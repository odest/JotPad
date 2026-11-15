import { Stack } from 'expo-router';

import { setNoteSort, type NoteSort } from '@/data/preferences';

import { SORT_OPTIONS } from './sort-notes';

export type NotesHeaderProps = {
  sort: NoteSort;
  onNewNote: () => void;
};

/** The notes list's header items on iOS: a sort menu and the compose button. */
export function NotesHeader({ sort, onNewNote }: NotesHeaderProps) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="arrow.up.arrow.down" accessibilityLabel="Sort notes">
        {SORT_OPTIONS.map((option) => (
          <Stack.Toolbar.MenuAction
            key={option.sort}
            isOn={sort === option.sort}
            onPress={() => setNoteSort(option.sort)}
          >
            {option.label}
          </Stack.Toolbar.MenuAction>
        ))}
      </Stack.Toolbar.Menu>
      <Stack.Toolbar.Button icon="square.and.pencil" onPress={onNewNote} />
    </Stack.Toolbar>
  );
}
