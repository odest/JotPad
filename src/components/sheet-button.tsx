import { Button } from '@expo/ui';

export type SheetButtonProps = {
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

/**
 * The confirming button at the bottom of a sheet: the system's filled button on iOS, a
 * full-width Material 3 Expressive medium button on Android (sheet-button.android.tsx).
 */
export function SheetButton({ label, disabled, onPress }: SheetButtonProps) {
  return <Button label={label} variant="filled" disabled={disabled} onPress={onPress} />;
}
