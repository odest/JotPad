import { useEffect } from 'react';
import { Alert } from 'react-native';

export type ErrorDialogProps = {
  isPresented: boolean;
  title: string;
  message: string;
  /** Shown as a second button when the failed action can simply be run again. */
  onRetry?: () => void;
  onDismiss: () => void;
};

/**
 * Tells the user that something they asked for did not happen. iOS uses the system
 * alert; Android (error-dialog.android.tsx) uses a Material 3 dialog.
 */
export function ErrorDialog({ isPresented, title, message, onRetry, onDismiss }: ErrorDialogProps) {
  useEffect(() => {
    if (!isPresented) return;
    Alert.alert(title, message, [
      { text: onRetry ? 'Cancel' : 'OK', style: 'cancel', onPress: onDismiss },
      ...(onRetry
        ? [
            {
              text: 'Try again',
              onPress: () => {
                onDismiss();
                onRetry();
              },
            },
          ]
        : []),
    ]);
    // Present once per open; the texts and handlers are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresented]);

  return null;
}
