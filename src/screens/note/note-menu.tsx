import { Stack } from 'expo-router';

import { type Note } from '@/data/notes-store';
import { t } from '@/i18n';

export type NoteMenuProps = {
  note: Note;
  onSearch: () => void;
  onTogglePin: () => void;
  onTags: () => void;
  onRename: () => void;
  onExport: () => void;
  onDelete: () => void;
};

/** The note's actions behind a "more" button in the header: the system menu on iOS. */
export function NoteMenu({
  note,
  onSearch,
  onTogglePin,
  onTags,
  onRename,
  onExport,
  onDelete,
}: NoteMenuProps) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="ellipsis" accessibilityLabel={t.common.moreOptions}>
        <Stack.Toolbar.MenuAction icon="magnifyingglass" onPress={onSearch}>
          {t.common.search}
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon={note.pinned ? 'pin.slash' : 'pin'} onPress={onTogglePin}>
          {note.pinned ? t.notes.unpinNote : t.notes.pinNote}
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="tag" onPress={onTags}>
          {t.common.tags}
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="pencil" onPress={onRename}>
          {t.common.rename}
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="square.and.arrow.up" onPress={onExport}>
          {t.common.export}
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="trash" destructive onPress={onDelete}>
          {t.notes.deleteNote}
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
