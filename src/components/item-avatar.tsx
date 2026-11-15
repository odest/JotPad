import { Text } from 'react-native';

import { type ColorValue, type TagTone } from '@/theme';

import { BADGE_SHAPES } from './badge-shapes';
import { Icon, type IconName } from './icon';
import { ShapedBadge } from './shaped-badge';

const TONES = [
  {
    container: 'primary-container',
    content: 'on-primary-container',
    text: 'text-on-primary-container',
  },
  {
    container: 'secondary-container',
    content: 'on-secondary-container',
    text: 'text-on-secondary-container',
  },
  {
    container: 'tertiary-container',
    content: 'on-tertiary-container',
    text: 'text-on-tertiary-container',
  },
] as const;

/** A shape and tone that stay the same for an item, so each one is easy to spot. */
function avatarFor(id: string) {
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

/**
 * The avatar of a note or tag: the first letter of its name, or an icon, on a shape
 * picked from its id.
 */
export function ItemAvatar({
  id,
  size,
  name,
  icon,
  tone: ownTone,
}: {
  id: string;
  size: number;
  /** Its first letter is shown when there is no icon. */
  name?: string;
  icon?: IconName;
  /** A color of its own (a tag's) in place of the tone picked from the id. */
  tone?: TagTone;
}) {
  const { shape, tone } = avatarFor(id);
  const container: ColorValue = ownTone?.container ?? tone.container;
  const content: ColorValue = ownTone?.content ?? tone.content;
  return (
    <ShapedBadge shape={shape} size={size} color={container}>
      {icon ? (
        <Icon name={icon} size={size / 2} color={content} />
      ) : (
        <Text
          className={`font-medium ${ownTone ? '' : tone.text}`}
          style={[
            { fontSize: size * 0.4, lineHeight: size * 0.5 },
            // An undefined color would still override the class name's color.
            ownTone && { color: ownTone.content },
          ]}
        >
          {name?.charAt(0).toUpperCase()}
        </Text>
      )}
    </ShapedBadge>
  );
}
