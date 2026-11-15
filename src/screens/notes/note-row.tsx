import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ItemAvatar } from '@/components/item-avatar';
import { useLastEntry, useTags, type Note } from '@/data/notes-store';
import { usePalette, useTagTone } from '@/theme';
import { formatListStamp } from '@/utils/format-time';
import { stripMarkdown } from '@/utils/markdown';
import { longPressFeedback } from '@/utils/haptics';
import { useLocale, useT } from '@/i18n';

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
  const t = useT();
  const locale = useLocale();
  const palette = usePalette();
  const lastEntry = useLastEntry(note.id);
  const toneOf = useTagTone();
  const tags = useTags().filter((tag) => note.tagIds.includes(tag.id));
  const first = tags[0];

  return (
    <Link href={{ pathname: '/note/[id]', params: { id: note.id } }} asChild>
      <Pressable
        onLongPress={
          onLongPress &&
          (() => {
            longPressFeedback();
            onLongPress(note);
          })
        }
        android_ripple={{ color: palette['surface-container-highest'] }}
        className="ios:active:bg-surface-container-high flex-row items-center gap-4 pl-4"
      >
        <ItemAvatar id={note.id} size={40} name={note.title} />
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
              {formatListStamp(lastEntry?.createdAt ?? note.createdAt, { t, locale })}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text numberOfLines={1} className="flex-1 text-subhead text-on-surface-variant">
              {stripMarkdown(preview ?? lastEntry?.body ?? '') || t.notes.noMessages}
            </Text>
            {/* The first tag sits beside the preview, so a tagged note is no taller. */}
            {first && (
              <View
                className="android:rounded-sm ios:rounded-full px-2 py-0.5"
                // A long tag name is cut short so the preview keeps most of the line.
                style={{ maxWidth: 112, backgroundColor: toneOf(first.color).container }}
              >
                <Text
                  numberOfLines={1}
                  className="text-caption font-medium"
                  style={{ color: toneOf(first.color).content }}
                >
                  {first.name}
                </Text>
              </View>
            )}
            {tags.length > 1 && (
              <Text className="text-caption text-on-surface-variant">+{tags.length - 1}</Text>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
