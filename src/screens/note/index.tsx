import { Stack, useRouter } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import Copy from '@expo/material-symbols/content_copy.xml';
import Delete from '@expo/material-symbols/delete.xml';
import Edit from '@expo/material-symbols/edit.xml';
import Keep from '@expo/material-symbols/keep.xml';
import KeepOff from '@expo/material-symbols/keep_off.xml';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type SheetAction } from '@/components/action-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { ExportSheet } from '@/components/export-sheet';
import { NameSheet } from '@/components/name-sheet';
import { NoteTagsSheet } from '@/components/note-tags-sheet';
import {
  addEntry,
  deleteEntry,
  deleteNote,
  renameNote,
  setEntryPinned,
  setNotePinned,
  updateEntry,
  useEntries,
  useNote,
  useTags,
  type Entry,
} from '@/data/notes-store';
import { usePalette } from '@/theme';
import { isSameDay } from '@/utils/format-time';

import { Composer } from './composer';
import { EntryActions } from './entry-actions';
import { EntryBubble, type EntryItem } from './entry-bubble';
import { NoteMenu } from './note-menu';
import { NoteSearchBar, searchHeaderOptions } from './note-search-bar';
import { NoteTitle } from './note-title';
import { PinnedBar } from './pinned-bar';
import { SearchNav } from './search-nav';

/** Entries sent within this window of each other are shown as one group. */
const GROUP_WINDOW_MS = 2 * 60 * 1000;

/** Newest first, because the list is inverted to stay anchored to the latest entry. */
function toItems(entries: Entry[]): EntryItem[] {
  const joins = (a: Entry | undefined, b: Entry | undefined) =>
    !!a &&
    !!b &&
    isSameDay(a.createdAt, b.createdAt) &&
    Math.abs(a.createdAt - b.createdAt) < GROUP_WINDOW_MS;

  return entries
    .map((entry, index) => {
      const previous = entries[index - 1];
      return {
        entry,
        startsDay: !previous || !isSameDay(previous.createdAt, entry.createdAt),
        joinsPrevious: joins(previous, entry),
        joinsNext: joins(entry, entries[index + 1]),
      };
    })
    .reverse();
}

/** How long a message stays tinted after a jump to it. */
const HIGHLIGHT_MS = 1200;

function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return open;
}

export function NoteChat({ noteId }: { noteId: string }) {
  const note = useNote(noteId);
  const entries = useEntries(noteId);
  const router = useRouter();

  // Sheets and dialog opened from the header menu.
  const [renamingNote, setRenamingNote] = useState(false);
  const [taggingNote, setTaggingNote] = useState(false);
  const [deletingNote, setDeletingNote] = useState(false);
  const [exporting, setExporting] = useState(false);
  const tags = useTags();
  const palette = usePalette();
  const insets = useSafeAreaInsets();

  const headerHeight = useHeaderHeight();
  const keyboardOpen = useKeyboardOpen();

  // The entry whose actions are showing, and the entry being edited in the composer.
  const [selected, setSelected] = useState<Entry | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);

  const [deleting, setDeleting] = useState<Entry | null>(null);
  const clearSelection = useCallback(() => setSelected(null), []);

  const items = toItems(entries);
  const list = useRef<FlatList<EntryItem>>(null);

  // Most recently pinned first. The bar shows one at a time and steps through them.
  const pinned = entries
    .filter((entry) => entry.pinnedAt !== null)
    .sort((a, b) => (b.pinnedAt ?? 0) - (a.pinnedAt ?? 0));
  const [pinStep, setPinStep] = useState(0);
  const pinIndex = pinned.length > 0 ? pinStep % pinned.length : 0;

  const [highlighted, setHighlighted] = useState<string | null>(null);
  useEffect(() => {
    if (!highlighted) return;
    const timer = setTimeout(() => setHighlighted(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlighted]);

  const scrollTo = (entry: Entry) => {
    const index = items.findIndex((item) => item.entry.id === entry.id);
    if (index >= 0) list.current?.scrollToIndex({ index, viewPosition: 0.5 });
  };

  const jumpTo = (entry: Entry) => {
    scrollTo(entry);
    setHighlighted(entry.id);
    setPinStep(pinIndex + 1);
  };

  // Search mode: the header becomes a search field and the composer a match navigator.
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const needle = query.trim().toLocaleLowerCase();
  const matches = needle
    ? entries.filter((entry) => entry.body.toLocaleLowerCase().includes(needle))
    : [];
  // Index into `matches` (oldest first); null follows the newest match as the query changes.
  const [matchStep, setMatchStep] = useState<number | null>(null);
  const matchIndex =
    matches.length === 0 ? 0 : Math.min(matchStep ?? matches.length - 1, matches.length - 1);
  const currentMatch = matches[matchIndex];

  const changeQuery = (text: string) => {
    setQuery(text);
    setMatchStep(null);
  };

  const closeSearch = useCallback(() => {
    setSearching(false);
    setQuery('');
    setMatchStep(null);
  }, []);

  const searchProps = { query, onChangeQuery: changeQuery, onClose: closeSearch };
  const searchOptions = searchHeaderOptions(searchProps);

  // Keep the current match in view as it changes.
  const currentMatchId = currentMatch?.id;
  useEffect(() => {
    if (!currentMatchId) return;
    const index = items.findIndex((item) => item.entry.id === currentMatchId);
    if (index >= 0) list.current?.scrollToIndex({ index, viewPosition: 0.5 });
    // Only a new match should move the list, not every render of `items`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMatchId]);

  const actions: SheetAction[] = selected
    ? [
        selected.pinnedAt !== null
          ? { label: 'Unpin', icon: KeepOff, onPress: () => setEntryPinned(selected, false) }
          : {
              label: 'Pin',
              icon: Keep,
              onPress: () => {
                setEntryPinned(selected, true);
                // The newly pinned message is the one the bar shows.
                setPinStep(0);
              },
            },
        { label: 'Copy', icon: Copy, onPress: () => Clipboard.setStringAsync(selected.body) },
        { label: 'Edit', icon: Edit, onPress: () => setEditing(selected) },
        {
          label: 'Delete',
          icon: Delete,
          destructive: true,
          onPress: () => setDeleting(selected),
        },
      ]
    : [];

  return (
    <>
      <Stack.Screen
        options={{
          title: note?.title ?? '',
          ...(process.env.EXPO_OS === 'android' &&
            note && { headerTitle: () => <NoteTitle note={note} /> }),
          // Set every time, so leaving search mode restores the normal header.
          headerShown: true,
          headerSearchBarOptions: undefined,
          ...(searching && searchOptions),
        }}
      />
      {note && !searching && (
        <NoteMenu
          note={note}
          onSearch={() => setSearching(true)}
          onTogglePin={() => setNotePinned(note.id, !note.pinned)}
          onTags={() => setTaggingNote(true)}
          onRename={() => setRenamingNote(true)}
          onExport={() => setExporting(true)}
          onDelete={() => setDeletingNote(true)}
        />
      )}
      <KeyboardAvoidingView
        behavior="padding"
        // Without the stack header, the search bar is inside this view and needs no offset.
        keyboardVerticalOffset={searching && searchOptions.headerShown === false ? 0 : headerHeight}
        // Closed, the composer clears the system navigation bar; open, the keyboard covers it.
        style={{
          flex: 1,
          backgroundColor: palette.surface,
          paddingBottom: keyboardOpen ? 0 : insets.bottom,
        }}
      >
        {searching ? (
          <NoteSearchBar {...searchProps} />
        ) : (
          <PinnedBar pinned={pinned} index={pinIndex} onPress={jumpTo} />
        )}
        {entries.length === 0 ? (
          <EmptyState
            icon={{ ios: 'text.bubble', android: 'chat_bubble' }}
            title="Nothing here yet"
            message="Write your first message below."
          />
        ) : (
          <FlatList
            ref={list}
            inverted
            data={items}
            keyExtractor={(item) => item.entry.id}
            renderItem={({ item }) => (
              <EntryBubble
                item={item}
                highlighted={
                  item.entry.id === highlighted ||
                  item.entry.id === selected?.id ||
                  (searching && item.entry.id === currentMatchId)
                }
                query={searching ? query : ''}
                onLongPress={setSelected}
              />
            )}
            // Rows have different heights, so a far row may not be measured yet: scroll
            // near it first, then retry once it has rendered.
            onScrollToIndexFailed={({ index, averageItemLength }) => {
              list.current?.scrollToOffset({ offset: index * averageItemLength });
              setTimeout(() => list.current?.scrollToIndex({ index, viewPosition: 0.5 }), 100);
            }}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="px-3 py-2"
          />
        )}
        {searching ? (
          <SearchNav
            query={query}
            count={matches.length}
            index={matchIndex}
            onOlder={() => setMatchStep(Math.max(0, matchIndex - 1))}
            onNewer={() => setMatchStep(Math.min(matches.length - 1, matchIndex + 1))}
          />
        ) : (
          <Composer
            // Remounts for each edited entry so the draft starts from its text.
            key={editing?.id ?? 'new'}
            editingBody={editing?.body}
            onCancelEdit={() => setEditing(null)}
            onSubmit={(body) => {
              if (editing) {
                updateEntry(editing, body);
                setEditing(null);
              } else {
                addEntry(noteId, body);
              }
            }}
          />
        )}
        <EntryActions
          isPresented={selected !== null}
          onDismiss={clearSelection}
          actions={actions}
        />
      </KeyboardAvoidingView>
      <ConfirmDialog
        isPresented={deleting !== null}
        title="Delete message?"
        message="This message will be removed from the note."
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleting && deleteEntry(deleting)}
        onDismiss={() => setDeleting(null)}
      />
      <NameSheet
        // Remounts after a rename so the field starts from the current title.
        key={note?.title}
        isPresented={renamingNote}
        heading="Rename note"
        placeholder="Title"
        submitLabel="Save"
        initialValue={note?.title}
        onDismiss={() => setRenamingNote(false)}
        onSubmit={(title) => {
          renameNote(noteId, title);
          setRenamingNote(false);
        }}
      />
      {note && (
        <ExportSheet
          isPresented={exporting}
          onDismiss={() => setExporting(false)}
          name={note.title}
          data={() => ({ notes: [note], entries: { [note.id]: entries }, tags })}
        />
      )}
      <NoteTagsSheet noteId={taggingNote ? noteId : null} onDismiss={() => setTaggingNote(false)} />
      <ConfirmDialog
        isPresented={deletingNote}
        title="Delete note?"
        message={`"${note?.title ?? ''}" and all of its messages will be deleted.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          // Leave first, so the screen never renders a note that no longer exists.
          router.back();
          deleteNote(noteId);
        }}
        onDismiss={() => setDeletingNote(false)}
      />
    </>
  );
}
