import { Text, View } from 'react-native';

import { Icon, type IconName } from './icon';

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
      <Icon name={icon} size={48} color="on-surface-variant" />
      <Text className="mt-2 text-center text-title text-on-surface">{title}</Text>
      <Text className="text-center text-subhead text-on-surface-variant">{message}</Text>
    </View>
  );
}
