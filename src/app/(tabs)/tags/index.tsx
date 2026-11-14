import { ScrollView } from 'react-native';

import { EmptyState } from '@/components/empty-state';

export default function TagsScreen() {
  return (
    <ScrollView
      className="bg-surface"
      contentContainerClassName="grow"
      contentInsetAdjustmentBehavior="automatic"
    >
      <EmptyState
        icon={{ ios: 'tag', android: 'sell' }}
        title="No tags yet"
        message="Tags you add to notes will show up here."
      />
    </ScrollView>
  );
}
