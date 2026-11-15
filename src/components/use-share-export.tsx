import { useState } from 'react';

import { useT } from '@/i18n';
import { type ExportData, type ExportFormat, shareExport } from '@/utils/export-notes';

import { ErrorDialog } from './error-dialog';

/**
 * Shares an export in a chosen format. Render `errorDialog` next to the trigger: it
 * reports a failed export and offers to try the same format again.
 */
export function useShareExport(data: () => ExportData, name: string) {
  const t = useT();
  // The format that failed, so the error dialog can try it again.
  const [failed, setFailed] = useState<ExportFormat | null>(null);

  const share = (format: ExportFormat) => {
    shareExport(data(), format, name).catch((error: unknown) => {
      console.warn('Export failed', error);
      setFailed(format);
    });
  };

  const errorDialog = (
    <ErrorDialog
      isPresented={failed !== null}
      title={t.export.failedTitle}
      message={t.export.failedMessage}
      onRetry={() => failed && share(failed)}
      onDismiss={() => setFailed(null)}
    />
  );

  return { share, errorDialog };
}
