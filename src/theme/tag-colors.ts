import { type ColorScheme } from './colors';

export const TAG_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
] as const;

export type TagColor = (typeof TAG_COLORS)[number];

/** A filled surface for a tag and the color of content on it. */
export type TagTone = { container: `#${string}`; content: `#${string}` };

/**
 * Material 3 tonal pairs: a tone 90 container with tone 10 content in light, tone 30
 * with tone 90 in dark. They sit next to the dynamic colors without clashing.
 */
const material: Record<ColorScheme, Record<TagColor, TagTone>> = {
  light: {
    red: { container: '#FFDAD6', content: '#410002' },
    orange: { container: '#FFDBC8', content: '#331200' },
    yellow: { container: '#F6E388', content: '#221B00' },
    green: { container: '#C2EFAE', content: '#052100' },
    teal: { container: '#A6F1E6', content: '#00201D' },
    blue: { container: '#D6E3FF', content: '#001B3E' },
    purple: { container: '#EBDDFF', content: '#250059' },
    pink: { container: '#FFD8EC', content: '#3A0029' },
  },
  dark: {
    red: { container: '#93000A', content: '#FFDAD6' },
    orange: { container: '#723600', content: '#FFDBC8' },
    yellow: { container: '#544600', content: '#F6E388' },
    green: { container: '#2A5020', content: '#C2EFAE' },
    teal: { container: '#005049', content: '#A6F1E6' },
    blue: { container: '#284777', content: '#D6E3FF' },
    purple: { container: '#563A8F', content: '#EBDDFF' },
    pink: { container: '#7B2A5B', content: '#FFD8EC' },
  },
};

/** iOS system colors: the color itself fills the shape and white content sits on it. */
const ios: Record<ColorScheme, Record<TagColor, `#${string}`>> = {
  light: {
    red: '#FF3B30',
    orange: '#FF9500',
    yellow: '#FFCC00',
    green: '#34C759',
    teal: '#30B0C7',
    blue: '#007AFF',
    purple: '#AF52DE',
    pink: '#FF2D55',
  },
  dark: {
    red: '#FF453A',
    orange: '#FF9F0A',
    yellow: '#FFD60A',
    green: '#30D158',
    teal: '#40C8E0',
    blue: '#0A84FF',
    purple: '#BF5AF2',
    pink: '#FF375F',
  },
};

export function getTagTone(color: TagColor, scheme: ColorScheme): TagTone {
  if (process.env.EXPO_OS === 'ios') {
    return { container: ios[scheme][color], content: '#FFFFFF' };
  }
  return material[scheme][color];
}
