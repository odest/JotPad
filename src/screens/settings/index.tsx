import IosShare from '@expo/material-symbols/ios_share.xml';
import { FieldGroup, Icon, ListItem } from '@expo/ui';
import { useState } from 'react';
import { View } from 'react-native';

import { ExportSheet } from '@/components/export-sheet';
import { NativeHost } from '@/components/native-host';
import { useAllEntries, useNotes, useTags } from '@/data/notes-store';
import { languageSetting, setThemeMode, useThemeMode } from '@/data/preferences';
import { setLanguage, useT } from '@/i18n';
import { usePalette } from '@/theme';
import { allNotesFileName } from '@/utils/export-notes';

import { ChoicePicker } from './choice-picker';
import { languageChoices, themeChoices } from './options';

/**
 * Settings are the platform's own grouped form (@expo/ui): Material list items on
 * Android, an inset grouped list on iOS.
 */
export function Settings() {
  const t = useT();
  const palette = usePalette();
  const theme = useThemeMode();
  const language = languageSetting.useValue();
  const [exporting, setExporting] = useState(false);

  const notes = useNotes();
  const entries = useAllEntries();
  const tags = useTags();

  return (
    <View style={{ flex: 1, backgroundColor: palette.surface }}>
      <NativeHost style={{ flex: 1 }}>
        <FieldGroup>
          <FieldGroup.Section title={t.settings.theme}>
            <ChoicePicker choices={themeChoices(t)} value={theme} onChange={setThemeMode} />
          </FieldGroup.Section>
          <FieldGroup.Section title={t.settings.language}>
            <ChoicePicker choices={languageChoices(t)} value={language} onChange={setLanguage} />
          </FieldGroup.Section>
          <FieldGroup.Section title={t.settings.data}>
            <ListItem
              onPress={notes.length > 0 ? () => setExporting(true) : undefined}
              supportingText={
                notes.length > 0 ? t.settings.exportAllHint : t.settings.nothingToExport
              }
              leading={
                <Icon
                  name={{ ios: 'square.and.arrow.up', android: IosShare }}
                  color={palette['on-surface-variant']}
                />
              }
            >
              {t.settings.exportAll}
            </ListItem>
          </FieldGroup.Section>
        </FieldGroup>
      </NativeHost>
      <ExportSheet
        isPresented={exporting}
        onDismiss={() => setExporting(false)}
        name={allNotesFileName(t)}
        data={() => ({ notes, entries, tags })}
      />
    </View>
  );
}
