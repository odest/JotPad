import { BottomSheet, Button, Column, Host, Text, TextInput } from '@expo/ui';
import { useRef, useState } from 'react';

import { typeRamp, usePalette } from '@/theme';

/**
 * Sheet with a single title field, used to create and to rename a note. Built from
 * @expo/ui so it is the platform's own sheet, text field and button: Material 3 on
 * Android, SwiftUI on iOS.
 *
 * The field starts from `initialTitle`; give the sheet a `key` per note when renaming.
 */
export function NoteTitleSheet({
  isPresented,
  heading,
  submitLabel,
  initialTitle = '',
  onDismiss,
  onSubmit,
}: {
  isPresented: boolean;
  heading: string;
  submitLabel: string;
  initialTitle?: string;
  onDismiss: () => void;
  onSubmit: (title: string) => void;
}) {
  const title = useRef(initialTitle);
  const [canSubmit, setCanSubmit] = useState(initialTitle.trim().length > 0);
  const palette = usePalette();

  const reset = () => {
    title.current = initialTitle;
    setCanSubmit(initialTitle.trim().length > 0);
  };

  const submit = () => {
    const value = title.current.trim();
    if (!value) return;
    reset();
    onSubmit(value);
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
            {heading}
          </Text>
          <TextInput
            autoFocus
            defaultValue={initialTitle}
            // Renaming usually replaces the whole title.
            selectTextOnFocus={initialTitle.length > 0}
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
              setCanSubmit(text.trim().length > 0);
            }}
            onSubmitEditing={submit}
          />
          <Button label={submitLabel} variant="filled" disabled={!canSubmit} onPress={submit} />
        </Column>
      </BottomSheet>
    </Host>
  );
}
