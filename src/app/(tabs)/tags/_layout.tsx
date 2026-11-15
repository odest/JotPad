import { Stack } from 'expo-router';

import { TabSwipe } from '@/navigation/tab-swipe';
import { useStackOptions } from '@/navigation/use-stack-options';

export default function TagsLayout() {
  return (
    <TabSwipe index={1}>
      <Stack screenOptions={useStackOptions()}>
        <Stack.Screen name="index" options={{ title: 'Tags', headerLargeTitleEnabled: true }} />
      </Stack>
    </TabSwipe>
  );
}
