import { ListItem } from '@expo/ui';

export type RowAction = { key: string; label: string; onPress: () => void };

export type ActionRowProps = {
  actions: RowAction[];
  disabled?: boolean;
};

/**
 * A few actions inside a settings section. iOS lists them as tappable rows; Android
 * puts them side by side as buttons, like the pickers above (action-row.android.tsx).
 */
export function ActionRow({ actions, disabled = false }: ActionRowProps) {
  return (
    <>
      {actions.map((action) => (
        <ListItem key={action.key} onPress={disabled ? undefined : action.onPress}>
          {action.label}
        </ListItem>
      ))}
    </>
  );
}
