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
import { CircleX, Tag, Plus } from "lucide-react";

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

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput("");
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
    else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
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

        <div className="grid gap-6 py-4">
          <div className="flex items-center">
            
            <div className="relative flex-grow">
              <div className="w-6 h-6 rounded-full flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 border border-primary text-primary font-bold text-lg shrink-0">
                <p className="text-sm">{noteTitle.charAt(0).toUpperCase()}</p>
              </div>
              <Input
                id="name"
                autoComplete="off"
                placeholder={t('enter_note_title')}
                className="pl-10"
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
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tags"
                  autoComplete="off"
                  placeholder={t('enter_tags')}
                  className="pl-10"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                />
              </div>
              <Button type="button" size="icon" onClick={handleAddTag} disabled={!tagInput.trim()}>
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-md py-1 px-2 gap-1.5 items-center">
                    {tag}
                    <button type="button" className="rounded-full hover:bg-muted-foreground/20" onClick={() => handleRemoveTag(tag)}>
                      <CircleX className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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