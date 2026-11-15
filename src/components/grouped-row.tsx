import { type ReactNode } from 'react';

import { type GroupPosition } from './group-position';

export type GroupedRowProps = {
  position: GroupPosition;
  /** A heading above the group, shown on its first row. */
  label?: string;
  children: ReactNode;
};

/**
 * A list row as part of a group. iOS keeps its plain full-width rows; Android sets each
 * group on Material 3 Expressive connected cards (grouped-row.android.tsx).
 */
export function GroupedRow({ children }: GroupedRowProps) {
  return <>{children}</>;
}
