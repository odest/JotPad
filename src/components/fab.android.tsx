import { ExtendedFloatingActionButton, Icon, Text } from '@expo/ui/jetpack-compose';
import { View } from 'react-native';

import { NativeHost } from '@/components/native-host';

import { type FabProps } from './fab';

/** An extended FAB: icon and label, shrinking to the icon while its list scrolls down. */
export function Fab({ label, icon, expanded = true, onPress }: FabProps) {
  return (
    <View className="absolute bottom-4 right-4">
      <NativeHost matchContents>
        <ExtendedFloatingActionButton expanded={expanded} onClick={onPress}>
          <ExtendedFloatingActionButton.Icon>
            <Icon source={icon} contentDescription={label} />
          </ExtendedFloatingActionButton.Icon>
          <ExtendedFloatingActionButton.Text>
            <Text>{label}</Text>
          </ExtendedFloatingActionButton.Text>
        </ExtendedFloatingActionButton>
      </NativeHost>
    </View>
  );
}
