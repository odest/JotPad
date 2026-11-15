import { Button, Row, Text } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, padding, weight } from '@expo/ui/jetpack-compose/modifiers';

import { usePalette } from '@/theme';

import { type ActionRowProps } from './action-row';

/**
 * Buttons side by side, sized and colored like the unselected buttons of the pickers
 * above, so the settings sections read as one set of controls.
 */
export function ActionRow({ actions, disabled = false }: ActionRowProps) {
  const palette = usePalette();
  return (
    <Row
      horizontalArrangement={{ spacedBy: 2 }}
      modifiers={[fillMaxWidth(), padding(16, 8, 16, 8)]}
    >
      {actions.map((action) => (
        <Button
          key={action.key}
          enabled={!disabled}
          onClick={action.onPress}
          modifiers={[weight(1)]}
          colors={{
            containerColor: palette['surface-container-highest'],
            contentColor: palette['on-surface'],
          }}
        >
          <Text>{action.label}</Text>
        </Button>
      ))}
    </Row>
  );
}
