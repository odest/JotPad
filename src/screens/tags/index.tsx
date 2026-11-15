import Add from '@expo/material-symbols/add.xml';
import Delete from '@expo/material-symbols/delete.xml';
import Edit from '@expo/material-symbols/edit.xml';
import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { ActionSheet, type SheetAction } from '@/components/action-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { Fab } from '@/components/fab';
import { useFabExpanded } from '@/components/use-fab-expanded';
import { Icon } from '@/components/icon';
import { ItemAvatar } from '@/components/item-avatar';
import { NameSheet } from '@/components/name-sheet';
import { createTag, deleteTag, renameTag, useNotes, useTags, type Tag } from '@/data/notes-store';
import { usePalette } from '@/theme';
import { longPressFeedback } from '@/utils/haptics';

export function Tags() {
  const palette = usePalette();
  const tags = useTags();
  const notes = useNotes();

  const [isCreating, setIsCreating] = useState(false);
  // The tag whose actions are showing, and the tags being renamed or deleted.
  const [selected, setSelected] = useState<Tag | null>(null);
  const [renaming, setRenaming] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<Tag | null>(null);

  const startNewTag = () => setIsCreating(true);
  const countFor = (tag: Tag) => notes.filter((note) => note.tagIds.includes(tag.id)).length;

  const fab = useFabExpanded();

  const actions: SheetAction[] = selected
    ? [
        { label: 'Rename', icon: Edit, onPress: () => setRenaming(selected) },
        { label: 'Delete', icon: Delete, destructive: true, onPress: () => setDeleting(selected) },
      ]
    : [];

  return (
    <>
      <FlatList
        className="bg-surface"
        // Leaves room for the FAB below the last row on Android.
        contentContainerClassName="grow android:pb-16"
        contentInsetAdjustmentBehavior="automatic"
        data={tags}
        onScroll={fab.onScroll}
        scrollEventThrottle={16}
        keyExtractor={(tag) => tag.id}
        renderItem={({ item }) => {
          const count = countFor(item);
          return (
            <Link href={{ pathname: '/tags/[id]', params: { id: item.id } }} asChild>
              <Pressable
                onLongPress={() => {
                  longPressFeedback();
                  setSelected(item);
                }}
                android_ripple={{ color: palette['surface-container-highest'] }}
                className="ios:active:bg-surface-container-high min-h-14 flex-row items-center gap-4 px-4"
              >
                {process.env.EXPO_OS === 'android' ? (
                  <ItemAvatar id={item.id} size={40} icon={{ ios: 'tag', android: 'label' }} />
                ) : (
                  <Icon name={{ ios: 'tag', android: 'label' }} color="on-surface-variant" />
                )}
                <Text numberOfLines={1} className="flex-1 text-body text-on-surface">
                  {item.name}
                </Text>
                <Text className="text-subhead text-on-surface-variant">
                  {count === 1 ? '1 note' : `${count} notes`}
                </Text>
              </Pressable>
            </Link>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1">
            <EmptyState
              icon={{ ios: 'tag', android: 'label' }}
              title="No tags yet"
              message="Create tags to group your notes."
            />
          </View>
        }
      />
      {process.env.EXPO_OS === 'ios' && (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button icon="plus" onPress={startNewTag} />
        </Stack.Toolbar>
      )}
      <Fab label="New tag" icon={Add} expanded={fab.expanded} onPress={startNewTag} />
      <NameSheet
        isPresented={isCreating}
        heading="New tag"
        placeholder="Name"
        submitLabel="Create"
        onDismiss={() => setIsCreating(false)}
        onSubmit={(name) => {
          createTag(name);
          setIsCreating(false);
        }}
      />
      <NameSheet
        // Remounts per tag so the field starts from that tag's name.
        key={renaming?.id ?? 'rename'}
        isPresented={renaming !== null}
        heading="Rename tag"
        placeholder="Name"
        submitLabel="Save"
        initialValue={renaming?.name}
        onDismiss={() => setRenaming(null)}
        onSubmit={(name) => {
          if (renaming) renameTag(renaming.id, name);
          setRenaming(null);
        }}
      />
      <ActionSheet
        isPresented={selected !== null}
        onDismiss={() => setSelected(null)}
        actions={actions}
      />
      <ConfirmDialog
        isPresented={deleting !== null}
        title="Delete tag?"
        message={`"${deleting?.name ?? ''}" will be removed from every note. The notes are kept.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleting && deleteTag(deleting.id)}
        onDismiss={() => setDeleting(null)}
      />
    </>
  );
}
