import { Stack } from 'expo-router';

import { TabSwipe } from '@/navigation/tab-swipe';
import { useStackOptions } from '@/navigation/use-stack-options';

export default function SearchLayout() {
  return (
    <TabSwipe index={3}>
      <Stack screenOptions={useStackOptions()}>
        <Stack.Screen name="index" options={{ title: 'Search', headerLargeTitleEnabled: true }} />
      </Stack>
    </TabSwipe>
  );
}
