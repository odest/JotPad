import Delete from '@expo/material-symbols/delete.xml';
import Edit from '@expo/material-symbols/edit.xml';
import IosShare from '@expo/material-symbols/ios_share.xml';
import Keep from '@expo/material-symbols/keep.xml';
import KeepOff from '@expo/material-symbols/keep_off.xml';
import Label from '@expo/material-symbols/label.xml';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Animated from 'react-native-reanimated';

import { ActionSheet, type SheetAction } from '@/components/action-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { ExportSheet } from '@/components/export-sheet';
import { Fab } from '@/components/fab';
import { groupPosition } from '@/components/group-position';
import { GroupedRow } from '@/components/grouped-row';
import { listItemLayout } from '@/components/list-motion';
import { useFabExpanded } from '@/components/use-fab-expanded';
import { NameSheet } from '@/components/name-sheet';
import { NoteTagsSheet } from '@/components/note-tags-sheet';
import {
  createNote,
  deleteNote,
  renameNote,
  setNotePinned,
  useAllEntries,
  useNotes,
  useTags,
  type Note,
} from '@/data/notes-store';
import { useNoteSort } from '@/data/preferences';
import { usePalette } from '@/theme';
import { useT } from '@/i18n';

import { NoteRow } from './note-row';
import { NotesHeader } from './notes-header';
import { sortNotes } from './sort-notes';

export function Notes() {
  const t = useT();
  const notes = useNotes();
  const sort = useNoteSort();
  const palette = usePalette();
  const fab = useFabExpanded();
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  // The note whose actions are showing, and the notes being renamed or deleted.
  const [selected, setSelected] = useState<Note | null>(null);
  const [renaming, setRenaming] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState<Note | null>(null);
  const [tagging, setTagging] = useState<string | null>(null);
  const [exporting, setExporting] = useState<Note | null>(null);
  const entries = useAllEntries();
  const tags = useTags();

  const startNewNote = () => setIsCreating(true);

  const openNewNote = (title: string) => {
    const note = createNote(title);
    setIsCreating(false);
    router.push({ pathname: '/note/[id]', params: { id: note.id } });
  };

  const ordered = sortNotes(notes, sort);
  const pinnedCount = ordered.filter((note) => note.pinned).length;

  const actions: SheetAction[] = selected
    ? [
        selected.pinned
          ? {
              label: t.common.unpin,
              icon: KeepOff,
              onPress: () => setNotePinned(selected.id, false),
            }
          : { label: t.common.pin, icon: Keep, onPress: () => setNotePinned(selected.id, true) },
        { label: t.common.tags, icon: Label, onPress: () => setTagging(selected.id) },
        { label: t.common.rename, icon: Edit, onPress: () => setRenaming(selected) },
        { label: t.common.export, icon: IosShare, onPress: () => setExporting(selected) },
        {
          label: t.common.delete,
          icon: Delete,
          destructive: true,
          onPress: () => setDeleting(selected),
        },
      ]
    : [];

  return (
    <>
      <Animated.FlatList
        style={{ flex: 1, backgroundColor: palette.surface }}
        // Leaves room for the FAB below the last row on Android.
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: process.env.EXPO_OS === 'android' ? 8 : 0,
          paddingBottom: process.env.EXPO_OS === 'android' ? 64 : 0,
        }}
        itemLayoutAnimation={listItemLayout}
        contentInsetAdjustmentBehavior="automatic"
        data={ordered}
        onScroll={fab.onScroll}
        scrollEventThrottle={16}
        keyExtractor={(note) => note.id}
        renderItem={({ item, index }) => {
          // Pinned notes and the others form two groups.
          const inPinned = index < pinnedCount;
          const start = inPinned ? 0 : pinnedCount;
          const length = inPinned ? pinnedCount : ordered.length - pinnedCount;
          return (
            <GroupedRow
              position={groupPosition(index - start, length)}
              label={
                pinnedCount > 0 && index === start
                  ? inPinned
                    ? t.notes.pinned
                    : t.notes.others
                  : undefined
              }
            >
              <NoteRow note={item} onLongPress={setSelected} />
            </GroupedRow>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon={{ ios: 'bubble.left.and.bubble.right', android: 'forum' }}
            title={t.notes.emptyTitle}
            message={t.notes.emptyMessage}
          />
        }
      />
      <NotesHeader sort={sort} onNewNote={startNewNote} />
      <Fab label={t.notes.newNote} icon={Edit} expanded={fab.expanded} onPress={startNewNote} />
      <NameSheet
        isPresented={isCreating}
        heading={t.notes.newNote}
        placeholder={t.common.title}
        submitLabel={t.common.create}
        onDismiss={() => setIsCreating(false)}
        onSubmit={openNewNote}
      />
      <NameSheet
        // Remounts per note so the field starts from that note's title.
        key={renaming?.id ?? 'rename'}
        isPresented={renaming !== null}
        heading={t.notes.renameNote}
        placeholder={t.common.title}
        submitLabel={t.common.save}
        initialValue={renaming?.title}
        onDismiss={() => setRenaming(null)}
        onSubmit={(title) => {
          if (renaming) renameNote(renaming.id, title);
          setRenaming(null);
        }}
      />
      <NoteTagsSheet noteId={tagging} onDismiss={() => setTagging(null)} />
      <ExportSheet
        isPresented={exporting !== null}
        onDismiss={() => setExporting(null)}
        name={exporting?.title ?? ''}
        data={() => ({
          notes: exporting ? [exporting] : [],
          entries: exporting ? { [exporting.id]: entries[exporting.id] ?? [] } : {},
          tags,
        })}
      />
      <ActionSheet
        isPresented={selected !== null}
        onDismiss={() => setSelected(null)}
        actions={actions}
      />
      <ConfirmDialog
        isPresented={deleting !== null}
        title={t.notes.deleteTitle}
        message={t.notes.deleteMessage(deleting?.title ?? '')}
        confirmLabel={t.common.delete}
        destructive
        onConfirm={() => deleting && deleteNote(deleting.id)}
        onDismiss={() => setDeleting(null)}
      />
    </>
  );
}
