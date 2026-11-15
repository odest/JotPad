import { BottomSheet, Button, Column, Host, Text, TextInput } from '@expo/ui';
import { useRef, useState } from 'react';

import { typeRamp, usePalette } from '@/theme';

/**
 * Sheet for naming a new note. Built from @expo/ui so it is the platform's own sheet,
 * text field and button: Material 3 on Android, SwiftUI on iOS.
 */
export function NewNoteSheet({
  isPresented,
  onDismiss,
  onCreate,
}: {
  isPresented: boolean;
  onDismiss: () => void;
  onCreate: (title: string) => void;
}) {
  const title = useRef('');
  const [canCreate, setCanCreate] = useState(false);
  const palette = usePalette();

  const reset = () => {
    title.current = '';
    setCanCreate(false);
  };

  const create = () => {
    const value = title.current.trim();
    if (!value) return;
    reset();
    onCreate(value);
  };

  return (
    <Host matchContents>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={() => {
          reset();
          onDismiss();
        }}
      >
        <Column spacing={16} style={{ paddingHorizontal: 8, paddingBottom: 24 }}>
          <Text textStyle={{ fontSize: typeRamp.title.size, lineHeight: typeRamp.title.leading }}>
            New note
          </Text>
          <TextInput
            autoFocus
            placeholder="Title"
            maxLength={80}
            returnKeyType="done"
            placeholderTextColor={palette['on-surface-variant']}
            cursorColor={palette.primary}
            style={{
              width: '100%',
              padding: 16,
              borderRadius: 12,
              backgroundColor: palette['surface-container-highest'],
            }}
            onChangeText={(text) => {
              title.current = text;
              setCanCreate(text.trim().length > 0);
            }}
            onSubmitEditing={create}
          />
          <Button
            label="Create"
            variant="filled"
            disabled={!canCreate}
            onPress={create}
            style={{ width: '100%' }}
          />
        </Column>
      </BottomSheet>
    </Host>
  );
}
