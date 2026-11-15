import Delete from '@expo/material-symbols/delete.xml';
import { AlertDialog, Box, Icon, Text, TextButton } from '@expo/ui/jetpack-compose';
import { background, clip, Shapes, size } from '@expo/ui/jetpack-compose/modifiers';

import { NativeHost } from '@/components/native-host';
import { usePalette } from '@/theme';

import { type ConfirmDialogProps } from './confirm-dialog';
import { t } from '@/i18n';

/**
 * A Material 3 dialog. A destructive one leads with a trash icon on an Expressive shape,
 * so it reads as a warning before its text does.
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
  const palette = usePalette();
  if (!isPresented) return null;

  return (
    <NativeHost matchContents>
      <AlertDialog onDismissRequest={onDismiss}>
        {destructive && (
          <AlertDialog.Icon>
            <Box
              contentAlignment="center"
              modifiers={[
                size(56, 56),
                clip(Shapes.Material.Cookie9Sided),
                background(palette['secondary-container']),
              ]}
            >
              <Icon source={Delete} tint={palette.error} modifiers={[size(28, 28)]} />
            </Box>
          </AlertDialog.Icon>
        )}
        <AlertDialog.Title>
          <Text style={{ typography: 'headlineSmall' }}>{title}</Text>
        </AlertDialog.Title>
        <AlertDialog.Text>
          <Text style={{ typography: 'bodyMedium' }}>{message}</Text>
        </AlertDialog.Text>
        <AlertDialog.DismissButton>
          <TextButton onClick={onDismiss}>
            <Text>{t.common.cancel}</Text>
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
