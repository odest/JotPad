import Add from '@expo/material-symbols/add.xml';
import Delete from '@expo/material-symbols/delete.xml';
import Edit from '@expo/material-symbols/edit.xml';
import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ActionSheet, type SheetAction } from '@/components/action-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { Fab } from '@/components/fab';
import { groupPosition } from '@/components/group-position';
import { GroupedRow } from '@/components/grouped-row';
import { listItemLayout } from '@/components/list-motion';
import { useFabExpanded } from '@/components/use-fab-expanded';
import { Icon } from '@/components/icon';
import { ItemAvatar } from '@/components/item-avatar';
import { NameSheet } from '@/components/name-sheet';
import {
  createTag,
  deleteTag,
  nextTagColor,
  updateTag,
  useNotes,
  useTags,
  type Tag,
} from '@/data/notes-store';
import { usePalette, useTagTone, type TagColor } from '@/theme';
import { longPressFeedback } from '@/utils/haptics';

export function Tags() {
  const palette = usePalette();
  const toneOf = useTagTone();
  const tags = useTags();
  const notes = useNotes();

  const [isCreating, setIsCreating] = useState(false);
  // The tag whose actions are showing, and the tags being renamed or deleted.
  const [selected, setSelected] = useState<Tag | null>(null);
  const [renaming, setRenaming] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<Tag | null>(null);
  // The color picked in the create or edit sheet.
  const [draftColor, setDraftColor] = useState<TagColor>('red');

  const startNewTag = () => {
    setDraftColor(nextTagColor());
    setIsCreating(true);
  };
  const startEditing = (tag: Tag) => {
    setDraftColor(tag.color);
    setRenaming(tag);
  };
  const countFor = (tag: Tag) => notes.filter((note) => note.tagIds.includes(tag.id)).length;

  const fab = useFabExpanded();

  const actions: SheetAction[] = selected
    ? [
        { label: 'Edit', icon: Edit, onPress: () => startEditing(selected) },
        { label: 'Delete', icon: Delete, destructive: true, onPress: () => setDeleting(selected) },
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
        data={tags}
        onScroll={fab.onScroll}
        scrollEventThrottle={16}
        keyExtractor={(tag) => tag.id}
        renderItem={({ item, index }) => {
          const count = countFor(item);
          return (
            <GroupedRow position={groupPosition(index, tags.length)}>
              <Link href={{ pathname: '/tags/[id]', params: { id: item.id } }} asChild>
                <Pressable
                  onLongPress={() => {
                    longPressFeedback();
                    setSelected(item);
                  }}
                  android_ripple={{ color: palette['surface-container-highest'] }}
                  className="ios:active:bg-surface-container-high android:py-2 min-h-14 flex-row items-center gap-4 px-4"
                >
                  {process.env.EXPO_OS === 'android' ? (
                    <ItemAvatar
                      id={item.id}
                      size={40}
                      icon={{ ios: 'tag', android: 'label' }}
                      tone={toneOf(item.color)}
                    />
                  ) : (
                    <Icon
                      name={{ ios: 'tag.fill', android: 'label' }}
                      color={toneOf(item.color).container}
                    />
                  )}
                  <Text numberOfLines={1} className="flex-1 text-body text-on-surface">
                    {item.name}
                  </Text>
                  <Text className="text-subhead text-on-surface-variant">
                    {count === 1 ? '1 note' : `${count} notes`}
                  </Text>
                </Pressable>
              </Link>
            </GroupedRow>
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
        color={{ value: draftColor, onChange: setDraftColor }}
        onDismiss={() => setIsCreating(false)}
        onSubmit={(name) => {
          createTag(name, draftColor);
          setIsCreating(false);
        }}
      />
      <NameSheet
        // Remounts per tag so the field starts from that tag's name.
        key={renaming?.id ?? 'rename'}
        isPresented={renaming !== null}
        heading="Edit tag"
        placeholder="Name"
        submitLabel="Save"
        initialValue={renaming?.name}
        color={{ value: draftColor, onChange: setDraftColor }}
        onDismiss={() => setRenaming(null)}
        onSubmit={(name) => {
          if (renaming) updateTag(renaming.id, name, draftColor);
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
