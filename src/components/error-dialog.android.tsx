import ErrorIcon from '@expo/material-symbols/error.xml';
import { AlertDialog, Box, Icon, Text, TextButton } from '@expo/ui/jetpack-compose';
import { background, clip, Shapes, size } from '@expo/ui/jetpack-compose/modifiers';

import { NativeHost } from '@/components/native-host';
import { usePalette } from '@/theme';
import { useT } from '@/i18n';

import { type ErrorDialogProps } from './error-dialog';

/** A Material 3 dialog led by an error icon on the same Expressive shape as delete. */
export function ErrorDialog({ isPresented, title, message, onRetry, onDismiss }: ErrorDialogProps) {
  const t = useT();
  const palette = usePalette();
  if (!isPresented) return null;

  return (
    <NativeHost matchContents>
      <AlertDialog onDismissRequest={onDismiss}>
        <AlertDialog.Icon>
          <Box
            contentAlignment="center"
            modifiers={[
              size(56, 56),
              clip(Shapes.Material.Cookie9Sided),
              background(palette['secondary-container']),
            ]}
          >
            <Icon source={ErrorIcon} tint={palette.error} modifiers={[size(28, 28)]} />
          </Box>
        </AlertDialog.Icon>
        <AlertDialog.Title>
          <Text style={{ typography: 'headlineSmall' }}>{title}</Text>
        </AlertDialog.Title>
        <AlertDialog.Text>
          <Text style={{ typography: 'bodyMedium' }}>{message}</Text>
        </AlertDialog.Text>
        {onRetry ? (
          <>
            <AlertDialog.DismissButton>
              <TextButton onClick={onDismiss}>
                <Text>{t.common.cancel}</Text>
              </TextButton>
            </AlertDialog.DismissButton>
            <AlertDialog.ConfirmButton>
              <TextButton
                onClick={() => {
                  onDismiss();
                  onRetry();
                }}
              >
                <Text>{t.common.tryAgain}</Text>
              </TextButton>
            </AlertDialog.ConfirmButton>
          </>
        ) : (
          <AlertDialog.ConfirmButton>
            <TextButton onClick={onDismiss}>
              <Text>{t.common.ok}</Text>
            </TextButton>
          </AlertDialog.ConfirmButton>
        )}
      </AlertDialog>
    </NativeHost>
  );
}
