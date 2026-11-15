import Check from '@expo/material-symbols/check.xml';
import { Column, Icon, Row } from '@expo/ui';

import { TAG_COLORS, useTagTone, type TagColor } from '@/theme';

// Eight of these fit across the narrowest phone sheet.
const SWATCH = 32;

/**
 * A row of color swatches for a tag, for use inside an @expo/ui sheet. The chosen one
 * carries a check mark.
 */
export function TagColorPicker({
  value,
  onChange,
}: {
  value: TagColor;
  onChange: (color: TagColor) => void;
}) {
  const toneOf = useTagTone();
  return (
    <Row spacing={7} alignment="center">
      {TAG_COLORS.map((color) => {
        const tone = toneOf(color);
        return (
          <Column
            key={color}
            alignment="center"
            onPress={() => onChange(color)}
            style={{
              width: SWATCH,
              height: SWATCH,
              borderRadius: SWATCH / 2,
              backgroundColor: tone.container,
              paddingTop: 6,
              // Centers the 20 point check vertically.
            }}
          >
            {color === value && (
              <Icon name={{ ios: 'checkmark', android: Check }} size={20} color={tone.content} />
            )}
          </Column>
        );
      })}
    </Row>
  );
}
