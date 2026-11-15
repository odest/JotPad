import Check from '@expo/material-symbols/check.xml';
import { BottomSheet, Column, Icon, ListItem, Text } from '@expo/ui';

import { NativeHost } from './native-host';
import { setNoteTags, useNote, useTags } from '@/data/notes-store';
import { typeRamp, usePalette } from '@/theme';

/** Sheet that toggles which tags a note has. Pass the note's id to present it. */
export function NoteTagsSheet({
  noteId,
  onDismiss,
}: {
  noteId: string | null;
  onDismiss: () => void;
}) {
  const palette = usePalette();
  const tags = useTags();
  const note = useNote(noteId ?? '');
  const selected = note?.tagIds ?? [];

  const toggle = (tagId: string) => {
    if (!note) return;
    setNoteTags(
      note.id,
      selected.includes(tagId) ? selected.filter((id) => id !== tagId) : [...selected, tagId],
    );
  };

  return (
    <NativeHost matchContents>
      <BottomSheet isPresented={noteId !== null} onDismiss={onDismiss} contentPadding={0}>
        <Column style={{ paddingBottom: 16 }}>
          <Text
            style={{ paddingHorizontal: 16, paddingBottom: 8 }}
            textStyle={{ fontSize: typeRamp.title.size, lineHeight: typeRamp.title.leading }}
          >
            Tags
          </Text>
          {tags.length === 0 ? (
            <Text
              style={{ paddingHorizontal: 16, paddingVertical: 16 }}
              textStyle={{ color: palette['on-surface-variant'] }}
            >
              No tags yet. Create one in the Tags tab.
            </Text>
          ) : (
            tags.map((tag) => (
              <ListItem
                key={tag.id}
                onPress={() => toggle(tag.id)}
                colors={{ containerColor: 'transparent' }}
                trailing={
                  selected.includes(tag.id) ? (
                    <Icon name={{ ios: 'checkmark', android: Check }} color={palette.primary} />
                  ) : undefined
                }
              >
                {tag.name}
              </ListItem>
            ))
          )}
        </Column>
      </BottomSheet>
    </NativeHost>
  );
}
