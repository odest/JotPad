import { Stack } from 'expo-router';

import { setNoteSort, type NoteSort } from '@/data/preferences';
import { useT } from '@/i18n';

import { sortOptions } from './sort-notes';

export type NotesHeaderProps = {
  sort: NoteSort;
  onNewNote: () => void;
};

/** The notes list's header items on iOS: a sort menu and the compose button. */
export function NotesHeader({ sort, onNewNote }: NotesHeaderProps) {
  const t = useT();
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="arrow.up.arrow.down" accessibilityLabel={t.notes.sortNotes}>
        {sortOptions(t).map((option) => (
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
