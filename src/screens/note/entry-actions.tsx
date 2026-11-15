import { ActionSheet, type ActionSheetProps } from '@/components/action-sheet';

export type EntryActionsProps = ActionSheetProps;

/**
 * Actions for the selected message. iOS uses the system action sheet; Android shows a
 * Material 3 Expressive floating toolbar above the composer (entry-actions.android.tsx).
 */
export function EntryActions(props: EntryActionsProps) {
  return <ActionSheet {...props} />;
}
