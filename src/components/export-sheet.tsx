import DataObject from '@expo/material-symbols/data_object.xml';
import Description from '@expo/material-symbols/description.xml';
import Notes from '@expo/material-symbols/notes.xml';
import { useState } from 'react';

import { type ExportData, type ExportFormat, shareExport } from '@/utils/export-notes';

import { ActionSheet } from './action-sheet';
import { ErrorDialog } from './error-dialog';

/**
 * Asks for a file format, then hands the export to the system share sheet. Used for one
 * note (from its menu) and for every note (from Settings).
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
  // The format that failed, so the error dialog can try it again.
  const [failed, setFailed] = useState<ExportFormat | null>(null);

  const share = (format: ExportFormat) => {
    shareExport(data(), format, name).catch((error: unknown) => {
      console.warn('Export failed', error);
      setFailed(format);
    });
  };

  return (
    <>
      <ActionSheet
        isPresented={isPresented}
        onDismiss={onDismiss}
        actions={[
          { label: 'Markdown (.md)', icon: Description, onPress: () => share('markdown') },
          { label: 'Plain text (.txt)', icon: Notes, onPress: () => share('text') },
          { label: 'JSON (.json)', icon: DataObject, onPress: () => share('json') },
        ]}
      />
      <ErrorDialog
        isPresented={failed !== null}
        title="Couldn't export"
        message="The file could not be created or shared. Check that there is free space on the device and try again."
        onRetry={() => failed && share(failed)}
        onDismiss={() => setFailed(null)}
      />
    </>
  );
}
