import Check from '@expo/material-symbols/check.xml';
import { Icon, ListItem } from '@expo/ui';

import { usePalette } from '@/theme';

import { type Choice } from './options';

export type ChoicePickerProps<T extends string> = {
  choices: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * One choice out of a few, inside a settings section. iOS lists the options with a
 * checkmark; Android uses a Material 3 Expressive button group (choice-picker.android.tsx).
 */
export function ChoicePicker<T extends string>({ choices, value, onChange }: ChoicePickerProps<T>) {
  const palette = usePalette();
  return (
    <>
      {choices.map((choice) => (
        <ListItem
          key={choice.value}
          onPress={() => onChange(choice.value)}
          trailing={
            value === choice.value ? (
              <Icon name={{ ios: 'checkmark', android: Check }} color={palette.primary} />
            ) : undefined
          }
        >
          {choice.label}
        </ListItem>
      ))}
    </>
  );
}
