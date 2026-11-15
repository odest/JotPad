import { AlertDialog, Text, TextButton } from '@expo/ui/jetpack-compose';

import { NativeHost } from '@/components/native-host';
import { usePalette } from '@/theme';

import { type ConfirmDialogProps } from './confirm-dialog';

export function ConfirmDialog({
  isPresented,
  title,
  message,
  confirmLabel,
  destructive,
  onConfirm,
  onDismiss,
}: ConfirmDialogProps) {
  const palette = usePalette();
  if (!isPresented) return null;

  return (
    <NativeHost matchContents>
      <AlertDialog onDismissRequest={onDismiss}>
        <AlertDialog.Title>
          <Text style={{ typography: 'headlineSmall' }}>{title}</Text>
        </AlertDialog.Title>
        <AlertDialog.Text>
          <Text style={{ typography: 'bodyMedium' }}>{message}</Text>
        </AlertDialog.Text>
        <AlertDialog.DismissButton>
          <TextButton onClick={onDismiss}>
            <Text>Cancel</Text>
          </TextButton>
        </AlertDialog.DismissButton>
        <AlertDialog.ConfirmButton>
          <TextButton
            onClick={() => {
              onDismiss();
              onConfirm();
            }}
          >
            <Text color={destructive ? palette.error : undefined}>{confirmLabel}</Text>
          </TextButton>
        </AlertDialog.ConfirmButton>
      </AlertDialog>
    </NativeHost>
  );
}
