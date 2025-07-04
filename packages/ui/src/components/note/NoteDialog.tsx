import { ReactNode, useState, KeyboardEvent } from "react";
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
import { Badge } from "@repo/ui/components/badge";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { CircleX } from "lucide-react";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  onCreate: () => void;
  trigger?: ReactNode;
  isEdit?: boolean;
  tags: string[];
  setTags: (tags: string[]) => void;
}

export function NoteDialog({
  open,
  onOpenChange,
  noteTitle,
  setNoteTitle,
  onCreate,
  trigger,
  isEdit = false,
  tags,
  setTags,
}: NoteDialogProps) {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState("");

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

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
          <div className="grid grid-cols-4 items-center gap-4 mt-2">
            <Input
              id="tags"
              placeholder={'Enter tags (Enter or ,)'}
              className="col-span-4"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
            />
            <div className="col-span-4 flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="p-1 px-2 gap-2">
                  {tag}
                  <button type="button" className="ml-1 text-primary hover:text-red-500" onClick={() => handleRemoveTag(tag)}>
                    <CircleX className="w-4 h-4" />
                  </button>
                </Badge>
              ))}
            </div>
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