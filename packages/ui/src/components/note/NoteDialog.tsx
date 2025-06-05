import { ReactNode } from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('edit_note_title') : t('create_new_note')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('edit_note_title_desc') : t('create_new_note_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              placeholder={t('enter_note_title')}
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
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            onClick={onCreate}
            disabled={!noteTitle.trim()}
          >
            {isEdit ? t('save') : t('create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}