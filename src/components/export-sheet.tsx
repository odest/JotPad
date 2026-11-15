import DataObject from '@expo/material-symbols/data_object.xml';
import Description from '@expo/material-symbols/description.xml';
import Notes from '@expo/material-symbols/notes.xml';

import { useT } from '@/i18n';
import { type ExportData } from '@/utils/export-notes';

import { ActionSheet } from './action-sheet';
import { useShareExport } from './use-share-export';

/**
 * Asks for a file format, then hands the export to the system share sheet. Settings
 * shows the formats as buttons instead (see `useShareExport`).
 */
export function ExportSheet({
  isPresented,
  onDismiss,
  data,
  name,
}: {
  isPresented: boolean;
  onDismiss: () => void;
  /** Read when a format is picked, so the export has the latest data. */
  data: () => ExportData;
  /** File name without extension. */
  name: string;
}) {
  const t = useT();
  const { share, errorDialog } = useShareExport(data, name);

  return (
    <>
      <ActionSheet
        isPresented={isPresented}
        onDismiss={onDismiss}
        actions={[
          { label: t.export.markdown, icon: Description, onPress: () => share('markdown') },
          { label: t.export.text, icon: Notes, onPress: () => share('text') },
          { label: t.export.json, icon: DataObject, onPress: () => share('json') },
        ]}
      />
      {errorDialog}
    </>
  );
}
