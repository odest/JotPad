import { Stack } from 'expo-router';

import { TabSwipe } from '@/navigation/tab-swipe';
import { useStackOptions } from '@/navigation/use-stack-options';

export default function NotesLayout() {
  return (
    <TabSwipe index={0}>
      <Stack screenOptions={useStackOptions()}>
        <Stack.Screen name="index" options={{ title: 'Notes', headerLargeTitleEnabled: true }} />
      </Stack>
    </TabSwipe>
  );
}
