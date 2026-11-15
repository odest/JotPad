import { Row, Text, ToggleButton } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, padding, weight } from '@expo/ui/jetpack-compose/modifiers';

import { usePalette } from '@/theme';

import { type ChoicePickerProps } from './choice-picker';

/**
 * A Material 3 Expressive button group: the chosen button changes shape, and the
 * buttons sit close together so they read as one control.
 */
export function ChoicePicker<T extends string>({ choices, value, onChange }: ChoicePickerProps<T>) {
  const palette = usePalette();
  return (
    <Row
      horizontalArrangement={{ spacedBy: 2 }}
      modifiers={[fillMaxWidth(), padding(16, 8, 16, 8)]}
    >
      {choices.map((choice) => (
        <ToggleButton
          key={choice.value}
          checked={value === choice.value}
          onCheckedChange={() => onChange(choice.value)}
          modifiers={[weight(1)]}
          colors={{
            containerColor: palette['surface-container-highest'],
            contentColor: palette['on-surface'],
            checkedContainerColor: palette.primary,
            checkedContentColor: palette['on-primary'],
          }}
        >
          <Text>{choice.short}</Text>
        </ToggleButton>
      ))}
    </Row>
  );
}
