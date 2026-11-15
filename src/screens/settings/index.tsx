import { FieldGroup } from '@expo/ui';
import { View } from 'react-native';

import { NativeHost } from '@/components/native-host';
import { useShareExport } from '@/components/use-share-export';
import { useAllEntries, useNotes, useTags } from '@/data/notes-store';
import { languageSetting, setThemeMode, useThemeMode } from '@/data/preferences';
import { setLanguage, useT } from '@/i18n';
import { usePalette } from '@/theme';
import { allNotesFileName } from '@/utils/export-notes';

import { ActionRow } from './action-row';
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

  const notes = useNotes();
  const entries = useAllEntries();
  const tags = useTags();
  const { share, errorDialog } = useShareExport(
    () => ({ notes, entries, tags }),
    allNotesFileName(t),
  );

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
          <FieldGroup.Section title={t.settings.export}>
            <ActionRow
              disabled={notes.length === 0}
              actions={[
                {
                  key: 'markdown',
                  label: t.export.markdownShort,
                  onPress: () => share('markdown'),
                },
                { key: 'text', label: t.export.textShort, onPress: () => share('text') },
                { key: 'json', label: t.export.jsonShort, onPress: () => share('json') },
              ]}
            />
          </FieldGroup.Section>
        </FieldGroup>
      </NativeHost>
      {errorDialog}
    </View>
  );
}
