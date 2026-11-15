import { BottomSheet, Column, Host, Icon, ListItem } from '@expo/ui';
import { type ImageSourcePropType } from 'react-native';

import { usePalette } from '@/theme';

export type SheetAction = {
  label: string;
  /** Material Symbols drawable, shown on Android. */
  icon: ImageSourcePropType;
  destructive?: boolean;
  onPress: () => void;
};

export type ActionSheetProps = {
  isPresented: boolean;
  onDismiss: () => void;
  actions: SheetAction[];
};

/**
 * A short list of actions for one item. Android shows a Material bottom sheet with list
 * items; iOS (action-sheet.ios.tsx) shows the system action sheet.
 */
export function ActionSheet({ isPresented, onDismiss, actions }: ActionSheetProps) {
  const palette = usePalette();

  return (
    <Host matchContents>
      <BottomSheet isPresented={isPresented} onDismiss={onDismiss} contentPadding={0}>
        <Column style={{ paddingBottom: 16 }}>
          {actions.map((action) => {
            const color = action.destructive ? palette.error : palette['on-surface'];
            return (
              <ListItem
                key={action.label}
                onPress={() => {
                  onDismiss();
                  action.onPress();
                }}
                leading={<Icon name={action.icon} color={color} />}
                colors={{ containerColor: 'transparent', contentColor: color }}
              >
                {action.label}
              </ListItem>
            );
          })}
        </Column>
      </BottomSheet>
    </Host>
  );
}
