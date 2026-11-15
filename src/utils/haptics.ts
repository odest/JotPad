import * as Haptics from 'expo-haptics';

/** The platform's own feedback for a long press, played when an item is held. */
export function longPressFeedback() {
  const feedback =
    process.env.EXPO_OS === 'android'
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press)
      : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  // Haptics are a nicety: a device without them must not surface an error.
  feedback.catch(() => {});
}
