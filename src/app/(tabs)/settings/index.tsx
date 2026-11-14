import { ScrollView } from 'react-native';

import { EmptyState } from '@/components/empty-state';

export default function SettingsScreen() {
  return (
    <ScrollView
      className="bg-surface"
      contentContainerClassName="grow"
      contentInsetAdjustmentBehavior="automatic"
    >
      <EmptyState
        icon={{ ios: 'gearshape', android: 'settings' }}
        title="Nothing to set up yet"
        message="Appearance and language options will live here."
      />
    </ScrollView>
  );
}
