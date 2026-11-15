import { Stack } from 'expo-router';

import { type Note } from '@/data/notes-store';

export type NoteMenuProps = {
  note: Note;
  onTogglePin: () => void;
  onTags: () => void;
  onRename: () => void;
  onDelete: () => void;
};

/** The note's actions behind a "more" button in the header: the system menu on iOS. */
export function NoteMenu({ note, onTogglePin, onTags, onRename, onDelete }: NoteMenuProps) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="ellipsis" accessibilityLabel="More options">
        <Stack.Toolbar.MenuAction icon={note.pinned ? 'pin.slash' : 'pin'} onPress={onTogglePin}>
          {note.pinned ? 'Unpin note' : 'Pin note'}
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="tag" onPress={onTags}>
          Tags
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="pencil" onPress={onRename}>
          Rename
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="trash" destructive onPress={onDelete}>
          Delete note
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
