import Close from '@expo/material-symbols/close.xml';
import { HorizontalFloatingToolbar, Icon, IconButton } from '@expo/ui/jetpack-compose';
import { useEffect } from 'react';
import { BackHandler, View } from 'react-native';

import { NativeHost } from '@/components/native-host';
import { usePalette } from '@/theme';
import { useT } from '@/i18n';

import { type EntryActionsProps } from './entry-actions';

/**
 * A floating toolbar with the selected message's actions, floating above the composer.
 * Back or the close button clears the selection; an action clears it and then runs.
 */
export function EntryActions({ isPresented, onDismiss, actions }: EntryActionsProps) {
  const t = useT();
  const palette = usePalette();

  useEffect(() => {
    if (!isPresented) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismiss();
      return true;
    });
    return () => subscription.remove();
  }, [isPresented, onDismiss]);

  if (!isPresented) return null;

  return (
    <View
      pointerEvents="box-none"
      // Floats just above the composer.
      style={{ position: 'absolute', left: 0, right: 0, bottom: 80, alignItems: 'center' }}
    >
      <NativeHost matchContents>
        <HorizontalFloatingToolbar variant="standard">
          <IconButton onClick={onDismiss}>
            <Icon source={Close} contentDescription={t.note.clearSelection} />
          </IconButton>
          {actions.map((action) => (
            <IconButton
              key={action.label}
              onClick={() => {
                onDismiss();
                action.onPress();
              }}
            >
              <Icon
                source={action.icon}
                contentDescription={action.label}
                tint={action.destructive ? palette.error : undefined}
              />
            </IconButton>
          ))}
        </HorizontalFloatingToolbar>
      </NativeHost>
    </View>
  );
}
