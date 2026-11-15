import { useEffect } from 'react';
import { ActionSheetIOS } from 'react-native';

import { useT } from '@/i18n';

import { type ActionSheetProps } from './action-sheet';

export function ActionSheet({ isPresented, onDismiss, actions }: ActionSheetProps) {
  const t = useT();
  useEffect(() => {
    if (!isPresented) return;
    const destructive = actions.flatMap((action, index) => (action.destructive ? [index] : []));
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...actions.map((action) => action.label), t.common.cancel],
        cancelButtonIndex: actions.length,
        destructiveButtonIndex: destructive,
      },
      (index) => {
        onDismiss();
        actions[index]?.onPress();
      },
    );
    // Present once per open; the actions are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresented]);

  return null;
}
