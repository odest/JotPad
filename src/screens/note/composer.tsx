import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { typeRamp, usePalette } from '@/theme';

/**
 * Message field. With `editingBody` set it edits that text instead of writing a new
 * entry; give it a `key` per edited entry so the draft starts from the entry's text.
 */
export function Composer({
  onSubmit,
  editingBody,
  onCancelEdit,
}: {
  onSubmit: (body: string) => void;
  editingBody?: string;
  onCancelEdit?: () => void;
}) {
  const palette = usePalette();
  const isEditing = editingBody !== undefined;
  const [draft, setDraft] = useState(editingBody ?? '');
  const canSubmit = draft.trim().length > 0;

  // Editing starts from the action sheet. Focus once that sheet has closed; focusing
  // while it is still on screen leaves the keyboard hidden on Android.
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  useEffect(() => {
    if (!isEditing) return;
    const timer = setTimeout(() => {
      input.current?.blur();
      input.current?.focus();
    }, 600);
    return () => clearTimeout(timer);
  }, [isEditing]);

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(draft);
    setDraft('');
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View>
      {isEditing && (
        <View className="flex-row items-center gap-3 pl-5 pr-2 pt-2">
          <Icon name={{ ios: 'pencil', android: 'edit' }} size={18} color="primary" />
          <Text className="flex-1 text-subhead font-medium text-primary">Editing message</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel editing"
            onPress={onCancelEdit}
            hitSlop={8}
            android_ripple={{ color: palette['surface-container-highest'], borderless: true }}
            className="ios:active:opacity-60 h-10 w-10 items-center justify-center"
          >
            <Icon name={{ ios: 'xmark', android: 'close' }} size={20} color="on-surface-variant" />
          </Pressable>
        </View>
      )}
      <View className="flex-row items-end gap-2 px-2 py-2">
        <TextInput
          multiline
          ref={input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Message"
          placeholderTextColor={palette['on-surface-variant']}
          cursorColor={palette.primary}
          selectionColor={palette.primary}
          style={{ fontSize: typeRamp.body.size }}
          className="max-h-40 ios:border-hairline ios:border-outline-variant ios:bg-surface min-h-12 flex-1 rounded-2xl bg-surface-container-high px-4 py-3 text-on-surface"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Save' : 'Send'}
          accessibilityState={{ disabled: !canSubmit }}
          disabled={!canSubmit}
          onPress={submit}
          android_ripple={{ color: palette['on-primary'], foreground: true }}
          className={`ios:active:opacity-70 h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary ${canSubmit ? '' : 'opacity-40'}`}
        >
          <Icon
            name={
              isEditing
                ? { ios: 'checkmark', android: 'check' }
                : { ios: 'arrow.up', android: 'send' }
            }
            size={22}
            color="on-primary"
          />
        </Pressable>
      </View>
    </View>
  );
}
