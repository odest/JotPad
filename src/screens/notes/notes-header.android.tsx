import Check from '@expo/material-symbols/check.xml';
import Sort from '@expo/material-symbols/sort.xml';
import { DropdownMenu, DropdownMenuItem, Icon, IconButton, Text } from '@expo/ui/jetpack-compose';
import { Stack } from 'expo-router';
import { useState } from 'react';

import { NativeHost } from '@/components/native-host';
import { setNoteSort, type NoteSort } from '@/data/preferences';
import { usePalette } from '@/theme';

import { type NotesHeaderProps } from './notes-header';
import { SORT_OPTIONS } from './sort-notes';
import { t } from '@/i18n';

/**
 * The notes list's header items on Android: a sort menu. New notes come from the FAB,
 * so the header holds nothing else.
 */
export function NotesHeader({ sort }: NotesHeaderProps) {
  return <Stack.Screen options={{ headerRight: () => <SortMenu sort={sort} /> }} />;
}

function SortMenu({ sort }: { sort: NoteSort }) {
  const palette = usePalette();
  const [open, setOpen] = useState(false);

  return (
    <NativeHost matchContents>
      <DropdownMenu
        expanded={open}
        onDismissRequest={() => setOpen(false)}
        color={palette['surface-container']}
      >
        <DropdownMenu.Trigger>
          <IconButton onClick={() => setOpen(true)}>
            <Icon
              source={Sort}
              contentDescription={t.notes.sortNotes}
              tint={palette['on-surface']}
            />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          {SORT_OPTIONS.map((option) => {
            const selected = sort === option.sort;
            return (
              <DropdownMenuItem
                key={option.sort}
                elementColors={{
                  textColor: selected ? palette.primary : palette['on-surface'],
                  trailingIconColor: palette.primary,
                }}
                onClick={() => {
                  setOpen(false);
                  setNoteSort(option.sort);
                }}
              >
                <DropdownMenuItem.Text>
                  <Text>{option.label}</Text>
                </DropdownMenuItem.Text>
                {selected && (
                  <DropdownMenuItem.TrailingIcon>
                    <Icon source={Check} />
                  </DropdownMenuItem.TrailingIcon>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenu.Items>
      </DropdownMenu>
    </NativeHost>
  );
}
