import { LinearTransition } from 'react-native-reanimated';

/**
 * How list rows move when the list changes (a note added, removed or pinned): a spring
 * that settles without bouncing past its place. Reduced motion turns it off.
 */
export const listItemLayout = LinearTransition.springify(400).dampingRatio(0.8);
