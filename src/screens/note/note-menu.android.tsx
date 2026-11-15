import Delete from '@expo/material-symbols/delete.xml';
import Edit from '@expo/material-symbols/edit.xml';
import IosShare from '@expo/material-symbols/ios_share.xml';
import Keep from '@expo/material-symbols/keep.xml';
import KeepOff from '@expo/material-symbols/keep_off.xml';
import Label from '@expo/material-symbols/label.xml';
import MoreVert from '@expo/material-symbols/more_vert.xml';
import Search from '@expo/material-symbols/search.xml';
import { DropdownMenu, DropdownMenuItem, Icon, IconButton, Text } from '@expo/ui/jetpack-compose';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { type ImageSourcePropType } from 'react-native';

import { NativeHost } from '@/components/native-host';
import { usePalette } from '@/theme';

import { type NoteMenuProps } from './note-menu';
import { t } from '@/i18n';

/** The note's actions behind a "more" button in the header: a Material 3 menu on Android. */
export function NoteMenu(props: NoteMenuProps) {
  return <Stack.Screen options={{ headerRight: () => <MoreMenu {...props} /> }} />;
}

function MoreMenu({
  note,
  onSearch,
  onTogglePin,
  onTags,
  onRename,
  onExport,
  onDelete,
}: NoteMenuProps) {
  const palette = usePalette();
  const [open, setOpen] = useState(false);

  const items: {
    label: string;
    icon: ImageSourcePropType;
    destructive?: boolean;
    onPress: () => void;
  }[] = [
    { label: t.common.search, icon: Search, onPress: onSearch },
    note.pinned
      ? { label: t.notes.unpinNote, icon: KeepOff, onPress: onTogglePin }
      : { label: t.notes.pinNote, icon: Keep, onPress: onTogglePin },
    { label: t.common.tags, icon: Label, onPress: onTags },
    { label: t.common.rename, icon: Edit, onPress: onRename },
    { label: t.common.export, icon: IosShare, onPress: onExport },
    { label: t.notes.deleteNote, icon: Delete, destructive: true, onPress: onDelete },
  ];

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
              source={MoreVert}
              contentDescription={t.common.moreOptions}
              tint={palette['on-surface']}
            />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          {items.map((item) => {
            const color = item.destructive ? palette.error : palette['on-surface'];
            return (
              <DropdownMenuItem
                key={item.label}
                elementColors={{
                  textColor: color,
                  leadingIconColor: item.destructive
                    ? palette.error
                    : palette['on-surface-variant'],
                }}
                onClick={() => {
                  setOpen(false);
                  item.onPress();
                }}
              >
                <DropdownMenuItem.LeadingIcon>
                  <Icon source={item.icon} />
                </DropdownMenuItem.LeadingIcon>
                <DropdownMenuItem.Text>
                  <Text>{item.label}</Text>
                </DropdownMenuItem.Text>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenu.Items>
      </DropdownMenu>
    </NativeHost>
  );
}
