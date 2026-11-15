import { Stack } from 'expo-router';

import { TabSwipe } from '@/navigation/tab-swipe';
import { useStackOptions } from '@/navigation/use-stack-options';

export default function SettingsLayout() {
  return (
    <TabSwipe index={2}>
      <Stack screenOptions={useStackOptions()}>
        <Stack.Screen name="index" options={{ title: 'Settings', headerLargeTitleEnabled: true }} />
      </Stack>
    </TabSwipe>
  );
}
