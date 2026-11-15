import { useEffect } from 'react';
import { Alert } from 'react-native';

export type ConfirmDialogProps = {
  isPresented: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

/**
 * Asks before a consequential action. iOS uses the system alert; Android
 * (confirm-dialog.android.tsx) uses a Material 3 dialog.
 */
export function ConfirmDialog({
  isPresented,
  title,
  message,
  confirmLabel,
  destructive,
  onConfirm,
  onDismiss,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isPresented) return;
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: onDismiss },
      {
        text: confirmLabel,
        style: destructive ? 'destructive' : 'default',
        onPress: () => {
          onDismiss();
          onConfirm();
        },
      },
    ]);
    // Present once per open; the texts and handlers are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresented]);

  return null;
}
