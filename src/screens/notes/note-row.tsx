import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ItemAvatar } from '@/components/item-avatar';
import { useLastEntry, useTags, type Note } from '@/data/notes-store';
import { usePalette, useTagTone } from '@/theme';
import { formatListStamp } from '@/utils/format-time';
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
  // A few chips fit on one line; the rest are counted.
  const shown = tags.slice(0, 3);

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
          <Text numberOfLines={1} className="text-subhead text-on-surface-variant">
            {preview ?? lastEntry?.body ?? t.notes.noMessages}
          </Text>
          {tags.length > 0 && (
            <View className="mt-1 flex-row items-center gap-2">
              {shown.map((tag) => {
                const tone = toneOf(tag.color);
                return (
                  <View
                    key={tag.id}
                    className="android:rounded-sm ios:rounded-full shrink px-2 py-0.5"
                    style={{ backgroundColor: tone.container }}
                  >
                    <Text
                      numberOfLines={1}
                      className="text-caption font-medium"
                      style={{ color: tone.content }}
                    >
                      {tag.name}
                    </Text>
                  </View>
                );
              })}
              {tags.length > shown.length && (
                <Text className="text-caption text-on-surface-variant">
                  +{tags.length - shown.length}
                </Text>
              )}
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
