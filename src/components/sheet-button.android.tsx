import { Button, Text } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, height } from '@expo/ui/jetpack-compose/modifiers';

import { type SheetButtonProps } from './sheet-button';

/** Expressive medium button: 56dp tall and as wide as the sheet, so it is easy to reach. */
export function SheetButton({ label, disabled, onPress }: SheetButtonProps) {
  return (
    <Button enabled={!disabled} onClick={onPress} modifiers={[fillMaxWidth(), height(56)]}>
      <Text style={{ fontSize: 16, fontWeight: '500' }}>{label}</Text>
    </Button>
  );
}
