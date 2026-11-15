import { Text, View } from 'react-native';

import { ItemAvatar } from '@/components/item-avatar';
import { type Note } from '@/data/notes-store';

/** The note's avatar and title, for the header on Android, as a messaging app shows a chat. */
export function NoteTitle({ note }: { note: Note }) {
  return (
    <View
      className="flex-row items-center gap-3"
      // The app bar starts titles 72dp in, which leaves a wide gap after the back
      // button once an avatar leads; messaging apps keep the avatar close to it.
      style={{ marginLeft: -16 }}
    >
      <ItemAvatar id={note.id} size={32} name={note.title} />
      <Text numberOfLines={1} className="shrink text-title text-on-surface">
        {note.title}
      </Text>
    </View>
  );
}
