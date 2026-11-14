import { Stack } from 'expo-router';

import { useStackOptions } from '@/navigation/use-stack-options';

export default function NotesLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="index" options={{ title: 'Notes', headerLargeTitleEnabled: true }} />
    </Stack>
  );
}
