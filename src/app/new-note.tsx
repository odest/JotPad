import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { createNote } from '@/data/notes-store';
import { typeRamp, usePalette } from '@/theme';

export default function NewNoteSheet() {
  const router = useRouter();
  const palette = usePalette();
  const [title, setTitle] = useState('');
  const canCreate = title.trim().length > 0;

  const create = () => {
    if (!canCreate) return;
    const note = createNote(title);
    router.back();
    router.push({ pathname: '/note/[id]', params: { id: note.id } });
  };

  return (
    <View className="gap-4 px-4 pb-6 pt-8">
      <Text className="text-title text-on-surface ios:font-bold">New note</Text>
      <TextInput
        autoFocus
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={create}
        placeholder="Title"
        placeholderTextColor={palette['on-surface-variant']}
        cursorColor={palette.primary}
        selectionColor={palette.primary}
        returnKeyType="done"
        maxLength={80}
        // Font size only: a fixed line height misaligns single-line native inputs.
        style={{ fontSize: typeRamp.body.size }}
        className="h-14 rounded-md bg-surface-container-highest px-4 text-on-surface"
      />
      <Button title="Create" onPress={create} disabled={!canCreate} />
    </View>
  );
}
