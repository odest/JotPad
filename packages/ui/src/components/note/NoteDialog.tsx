import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  onCreate: () => void;
  trigger?: ReactNode;
  isEdit?: boolean;
}

export function NoteDialog({
  open,
  onOpenChange,
  noteTitle,
  setNoteTitle,
  onCreate,
  trigger,
  isEdit = false,
}: NoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Note" : "Create New Note"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Edit the title of your note and click save." : "Enter a title for your note and click create to get started."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              placeholder="Enter note title..."
              className="col-span-4"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && noteTitle.trim()) {
                  onCreate();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={onCreate}
            disabled={!noteTitle.trim()}
          >
            {isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}