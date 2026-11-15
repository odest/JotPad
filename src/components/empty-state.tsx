import { Text, View } from 'react-native';

import { Icon, type IconName } from './icon';
import { ShapedBadge } from './shaped-badge';

export function EmptyState({
  icon,
  title,
  message,
}: {
  icon: IconName;
  title: string;
  message: string;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8 py-12">
      {process.env.EXPO_OS === 'android' ? (
        // Material 3 Expressive puts the illustration in a large shape.
        <ShapedBadge shape="cookie9" size={112} color="primary-container">
          <Icon name={icon} size={48} color="on-primary-container" />
        </ShapedBadge>
      ) : (
        <Icon name={icon} size={48} color="on-surface-variant" />
      )}
      <Text className="mt-2 text-center text-title text-on-surface">{title}</Text>
      <Text className="text-center text-subhead text-on-surface-variant">{message}</Text>
    </View>
  );
}
