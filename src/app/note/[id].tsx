import { useLocalSearchParams } from 'expo-router';

import { NoteChat } from '@/screens/note';

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <NoteChat noteId={id} />;
}
