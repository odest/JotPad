import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { BADGE_SHAPES } from '@/components/badge-shapes';
import { ShapedBadge } from '@/components/shaped-badge';
import { useLastEntry, type Note } from '@/data/notes-store';
import { usePalette } from '@/theme';
import { formatListStamp } from '@/utils/format-time';

const TONES = [
  { container: 'primary-container', text: 'text-on-primary-container' },
  { container: 'secondary-container', text: 'text-on-secondary-container' },
  { container: 'tertiary-container', text: 'text-on-tertiary-container' },
] as const;

/** A shape and tone that stay the same for a note, so each note is easy to spot. */
function noteAvatar(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return {
    shape: BADGE_SHAPES[hash % BADGE_SHAPES.length],
    // iOS keeps every avatar in the tint color; tonal variety is a Material idea.
    tone:
      process.env.EXPO_OS === 'android'
        ? TONES[Math.floor(hash / BADGE_SHAPES.length) % TONES.length]
        : TONES[0],
  };
}

/** A note in a list. `preview` replaces the last entry as the second line (search results). */
export function NoteRow({
  note,
  preview,
  onLongPress,
}: {
  note: Note;
  preview?: string;
  onLongPress?: (note: Note) => void;
}) {
  const palette = usePalette();
  const lastEntry = useLastEntry(note.id);
  const avatar = noteAvatar(note.id);

  return (
    <Link href={{ pathname: '/note/[id]', params: { id: note.id } }} asChild>
      <Pressable
        onLongPress={onLongPress && (() => onLongPress(note))}
        android_ripple={{ color: palette['surface-container-highest'] }}
        className="ios:active:bg-surface-container-high flex-row items-center gap-4 pl-4"
      >
        <ShapedBadge shape={avatar.shape} size={40} color={avatar.tone.container}>
          <Text className={`text-headline font-medium ${avatar.tone.text}`}>
            {note.title.charAt(0).toUpperCase()}
          </Text>
        </ShapedBadge>
        <View className="ios:border-b-hairline min-h-16 flex-1 justify-center gap-0.5 border-outline-variant py-3 pr-4">
          <View className="flex-row items-center gap-2">
            <Text
              numberOfLines={1}
              className="ios:font-semibold flex-1 text-headline text-on-surface"
            >
              {note.title}
            </Text>
            {note.pinned && (
              <Icon
                name={{ ios: 'pin.fill', android: 'keep' }}
                size={16}
                color="on-surface-variant"
              />
            )}
            <Text className="text-footnote text-on-surface-variant">
              {formatListStamp(lastEntry?.createdAt ?? note.createdAt)}
            </Text>
          </View>
          <Text numberOfLines={1} className="text-subhead text-on-surface-variant">
            {preview ?? lastEntry?.body ?? 'No messages yet'}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
