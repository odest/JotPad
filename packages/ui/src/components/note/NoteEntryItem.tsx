import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@repo/ui/components/context-menu";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Pencil, Trash } from "lucide-react";
import { NoteEntry } from "@repo/ui/lib/database";
import { highlightText } from "@repo/ui/utils/textUtils";

interface NoteEntryItemProps {
  entry: NoteEntry;
  searchQuery: string;
  editingEntry: NoteEntry | null;
  editText: string;
  setEditText: (text: string) => void;
  handleEditEntry: (entry: NoteEntry) => void;
  handleSaveEdit: () => void;
  handleDeleteEntry: (entryId: string) => void;
  setEditingEntry: (entry: NoteEntry | null) => void;
}

export function NoteEntryItem({
  entry,
  searchQuery,
  editingEntry,
  editText,
  setEditText,
  handleEditEntry,
  handleSaveEdit,
  handleDeleteEntry,
  setEditingEntry
}: NoteEntryItemProps) {
  const isEditing = editingEntry?.id === entry.id;

  return (
    <div className="flex flex-col items-end w-full mb-5">
      <ContextMenu>
        {isEditing ? (
          <ContextMenuTrigger asChild>
            <div className="bg-muted p-4 rounded-2xl shadow-sm block max-w-[90%] md:max-w-[70%] min-w-[280px] md:min-w-[320px]">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                }}
                className="mb-4 text-lg border-2 border-primary bg-background/80 shadow focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                style={{ minWidth: '100%' }}
                autoFocus
              />
              <div className="flex justify-end gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingEntry(null);
                    setEditText("");
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
              </div>
            </div>
          </ContextMenuTrigger>
        ) : (
          <ContextMenuTrigger asChild>
            <div
              className="bg-muted p-3 rounded-xl shadow-sm inline-block max-w-[85%] md:max-w-[70%] text-left"
              style={{ wordBreak: 'break-word', minWidth: '70px'}}
            >
              <p className="text-[15px] md:text-sm whitespace-pre-wrap leading-relaxed">
                {highlightText(entry.text, searchQuery)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </ContextMenuTrigger>
        )}
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleEditEntry(entry)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
            onClick={() => handleDeleteEntry(entry.id)}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}