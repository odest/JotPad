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
    { label: 'Search', icon: Search, onPress: onSearch },
    note.pinned
      ? { label: 'Unpin note', icon: KeepOff, onPress: onTogglePin }
      : { label: 'Pin note', icon: Keep, onPress: onTogglePin },
    { label: 'Tags', icon: Label, onPress: onTags },
    { label: 'Rename', icon: Edit, onPress: onRename },
    { label: 'Export', icon: IosShare, onPress: onExport },
    { label: 'Delete note', icon: Delete, destructive: true, onPress: onDelete },
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
              contentDescription="More options"
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
