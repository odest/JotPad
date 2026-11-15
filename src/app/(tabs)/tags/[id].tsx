import { useLocalSearchParams } from 'expo-router';

import { TagNotes } from '@/screens/tags/tag-notes';

export default function TagNotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TagNotes tagId={id} />;
}
