import { BottomSheet, Column, Text, TextInput } from '@expo/ui';
import { useRef, useState } from 'react';

import { NativeHost } from './native-host';
import { SheetButton } from './sheet-button';
import { TagColorPicker } from './tag-color-picker';
import { typeRamp, usePalette, type TagColor } from '@/theme';

/**
 * Sheet with a single name field, used to create and to rename notes and tags. Built from
 * @expo/ui so it is the platform's own sheet, text field and button: Material 3 on
 * Android, SwiftUI on iOS.
 *
 * The field starts from `initialValue`; give the sheet a `key` per item when renaming.
 * Pass `color` to also offer tag colors below the field.
 */
export function NameSheet({
  isPresented,
  heading,
  submitLabel,
  initialValue = '',
  placeholder,
  color,
  onDismiss,
  onSubmit,
}: {
  isPresented: boolean;
  heading: string;
  submitLabel: string;
  initialValue?: string;
  onDismiss: () => void;
  placeholder: string;
  color?: { value: TagColor; onChange: (color: TagColor) => void };
  onSubmit: (name: string) => void;
}) {
  const title = useRef(initialValue);
  const [canSubmit, setCanSubmit] = useState(initialValue.trim().length > 0);
  const palette = usePalette();

  const reset = () => {
    title.current = initialValue;
    setCanSubmit(initialValue.trim().length > 0);
  };

  const submit = () => {
    const value = title.current.trim();
    if (!value) return;
    reset();
    onSubmit(value);
  };

  return (
    <NativeHost matchContents>
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
            defaultValue={initialValue}
            // Renaming usually replaces the whole name.
            selectTextOnFocus={initialValue.length > 0}
            placeholder={placeholder}
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
          {color && <TagColorPicker value={color.value} onChange={color.onChange} />}
          <SheetButton label={submitLabel} disabled={!canSubmit} onPress={submit} />
        </Column>
      </BottomSheet>
    </NativeHost>
  );
}
