import { useRef, useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

/** Scrolling less than this does not change the FAB, so small jitters are ignored. */
const THRESHOLD = 8;

/**
 * Material behavior for an extended FAB: it shrinks to its icon while the list scrolls
 * down and shows its label again on the way up or at the top. State changes only when
 * the direction does, so scrolling does not re-render the screen every frame.
 */
export function useFabExpanded() {
  const [expanded, setExpanded] = useState(true);
  const lastOffset = useRef(0);

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = nativeEvent.contentOffset.y;
    const delta = offset - lastOffset.current;
    if (offset <= 0) {
      setExpanded(true);
    } else if (Math.abs(delta) >= THRESHOLD) {
      setExpanded(delta < 0);
    } else {
      return;
    }
    lastOffset.current = offset;
  };

  return { expanded, onScroll };
}
