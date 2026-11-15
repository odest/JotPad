import Edit from '@expo/material-symbols/edit.xml';
import { Host } from '@expo/ui';
import { FloatingActionButton, Icon } from '@expo/ui/jetpack-compose';
import { View } from 'react-native';

import { type FabProps } from './fab';

export function Fab({ label, onPress }: FabProps) {
  return (
    <View className="absolute bottom-4 right-4">
      <Host matchContents>
        <FloatingActionButton onClick={onPress}>
          <FloatingActionButton.Icon>
            <Icon source={Edit} contentDescription={label} />
          </FloatingActionButton.Icon>
        </FloatingActionButton>
      </Host>
    </View>
  );
}
