import { type ImageSourcePropType } from 'react-native';

export type FabProps = {
  label: string;
  /** Material Symbols drawable. */
  icon: ImageSourcePropType;
  onPress: () => void;
};

/**
 * Floating action button. It is a Material pattern, so it only exists on Android
 * (fab.android.tsx); iOS puts the same action in the navigation bar.
 */
export function Fab(_props: FabProps) {
  return null;
}
