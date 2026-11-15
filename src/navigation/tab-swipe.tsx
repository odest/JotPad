import { useRouter, type Href } from 'expo-router';
import { type ReactNode } from 'react';
import { View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

/** Tab routes in tab bar order. */
const TABS: Href[] = ['/', '/tags', '/settings', '/search'];

/** A swipe counts when it travels this far, or is flicked at this speed. */
const MIN_DISTANCE = 64;
const MIN_VELOCITY = 600;

/**
 * Lets a horizontal swipe move to the neighbouring tab on Android. The tab bar is the
 * system's own, so the switch uses its transition; the content does not track the finger.
 * iOS tab bars do not swipe, so this is a pass-through there.
 */
export function TabSwipe({ index, children }: { index: number; children: ReactNode }) {
  const router = useRouter();

  const goTo = (offset: number) => {
    const target = TABS[index + offset];
    if (target) router.navigate(target);
  };

  const swipe = usePanGesture({
    // Only clearly horizontal drags: vertical scrolling must keep working.
    activeOffsetX: [-24, 24],
    failOffsetY: [-16, 16],
    onDeactivate: (event) => {
      'worklet';
      const { translationX, velocityX } = event;
      const far = Math.abs(translationX) > MIN_DISTANCE;
      const fast = Math.abs(velocityX) > MIN_VELOCITY;
      if (!far && !fast) return;
      // Swiping left reveals the tab to the right.
      scheduleOnRN(goTo, translationX < 0 ? 1 : -1);
    },
  });

  if (process.env.EXPO_OS !== 'android') return children;

  return (
    <GestureDetector gesture={swipe}>
      <View style={{ flex: 1 }} collapsable={false}>
        {children}
      </View>
    </GestureDetector>
  );
}
