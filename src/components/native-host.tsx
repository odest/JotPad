import { Host, type UniversalHostProps } from '@expo/ui';
import { useColorScheme } from 'react-native';

/**
 * Root for @expo/ui trees. It passes the app's color scheme on, so native components
 * follow the theme chosen in Settings instead of only the device setting.
 */
export function NativeHost(props: UniversalHostProps) {
  const scheme = useColorScheme();
  return <Host colorScheme={scheme === 'dark' ? 'dark' : 'light'} {...props} />;
}
