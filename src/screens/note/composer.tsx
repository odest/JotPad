import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import { typeRamp, usePalette } from '@/theme';

export function Composer({ onSend }: { onSend: (body: string) => void }) {
  const palette = usePalette();
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend(draft);
    setDraft('');
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View className="flex-row items-end gap-2 px-2 py-2">
      <TextInput
        multiline
        value={draft}
        onChangeText={setDraft}
        placeholder="Message"
        placeholderTextColor={palette['on-surface-variant']}
        cursorColor={palette.primary}
        selectionColor={palette.primary}
        style={{ fontSize: typeRamp.body.size }}
        className="max-h-40 min-h-12 flex-1 rounded-2xl bg-surface-container-high px-4 py-3 text-on-surface ios:border-hairline ios:border-outline-variant ios:bg-surface"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send"
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={send}
        android_ripple={{ color: palette['on-primary'], foreground: true }}
        className={`h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary ios:active:opacity-70 ${canSend ? '' : 'opacity-40'}`}
      >
        <Icon name={{ ios: 'arrow.up', android: 'send' }} size={22} color="on-primary" />
      </Pressable>
    </View>
  );
}
