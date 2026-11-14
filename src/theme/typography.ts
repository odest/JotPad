export type TextStyleName = 'title' | 'headline' | 'body' | 'subhead' | 'footnote' | 'caption';

type TypeRamp = Record<TextStyleName, { size: number; leading: number }>;

/** Apple text styles at the default Dynamic Type size. */
const ios: TypeRamp = {
  title: { size: 22, leading: 28 },
  headline: { size: 17, leading: 22 },
  body: { size: 17, leading: 22 },
  subhead: { size: 15, leading: 20 },
  footnote: { size: 13, leading: 18 },
  caption: { size: 12, leading: 16 },
};

/** Material 3 type scale: title large/medium, body large/medium, label medium/small. */
const android: TypeRamp = {
  title: { size: 22, leading: 28 },
  headline: { size: 16, leading: 24 },
  body: { size: 16, leading: 24 },
  subhead: { size: 14, leading: 20 },
  footnote: { size: 12, leading: 16 },
  caption: { size: 11, leading: 16 },
};

export const typeRamp = process.env.EXPO_OS === 'android' ? android : ios;
