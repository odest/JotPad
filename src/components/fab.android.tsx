import { FloatingActionButton, Icon } from '@expo/ui/jetpack-compose';
import { View } from 'react-native';

import { NativeHost } from '@/components/native-host';

import { type FabProps } from './fab';

export function Fab({ label, icon, onPress }: FabProps) {
  return (
    <View className="absolute bottom-4 right-4">
      <NativeHost matchContents>
        <FloatingActionButton onClick={onPress}>
          <FloatingActionButton.Icon>
            <Icon source={icon} contentDescription={label} />
          </FloatingActionButton.Icon>
        </FloatingActionButton>
      </NativeHost>
    </View>
  );
}
