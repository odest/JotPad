import { ReactNode, useState, KeyboardEvent, useEffect } from "react";
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
import { CircleX, Tag, Plus, Settings2 } from "lucide-react";
import { TagWithColor } from "@repo/ui/lib/database";
import { ColorPicker } from "@repo/ui/components/note/ColorPicker";
import { TagSuggestions } from "@repo/ui/components/note/TagSuggestions";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  onCreate: () => void;
  trigger?: ReactNode;
  isEdit?: boolean;
  tags: TagWithColor[];
  setTags: (tags: TagWithColor[]) => void;
  allGlobalTags: TagWithColor[];
  onOpenTagManager?: () => void;
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
  allGlobalTags,
  onOpenTagManager,
}: NoteDialogProps) {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = () => {
    const newTagName = tagInput.trim();
    if (newTagName && !tags.some(tag => tag.name === newTagName)) {
      const existingTag = allGlobalTags.find(tag => 
        tag.name.toLowerCase() === newTagName.toLowerCase()
      );

      const newTag: TagWithColor = {
        name: newTagName,
        color: existingTag ? existingTag.color : selectedColor
      };
      setTags([...tags, newTag]);
    }
    setTagInput("");
    setShowSuggestions(false);
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

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSelectSuggestion = (tag: TagWithColor) => {
    if (!tags.some(existingTag => existingTag.name === tag.name)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!open) {
      setTagInput("");
      setSelectedColor("#3b82f6");
      setShowSuggestions(false);
    }
  }, [open]);

  const handleRemoveTag = (tagToRemove: TagWithColor) => {
    setTags(tags.filter(tag => tag.name !== tagToRemove.name));
  }

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
              <ColorPicker
                color={selectedColor}
                onColorChange={setSelectedColor}
                className="shrink-0"
              />
              <div className="relative flex-grow">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tags"
                  autoComplete="off"
                  placeholder={t('enter_tags')}
                  className="pl-10"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  onFocus={() => setShowSuggestions(tagInput.trim().length > 0)}
                />
                <TagSuggestions
                  inputValue={tagInput}
                  allTags={allGlobalTags}
                  onSelectTag={handleSelectSuggestion}
                  visible={showSuggestions}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
              <Button type="button" size="icon" onClick={handleAddTag} disabled={!tagInput.trim()}>
                <Plus className="h-5 w-5" />
              </Button>
              {onOpenTagManager && (
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  onClick={onOpenTagManager}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag.name} 
                    variant="secondary" 
                    className="rounded-md py-1 px-2 gap-2 items-center border-2"
                    style={{ 
                      backgroundColor: `${tag.color}15`,
                      borderColor: tag.color,
                      color: tag.color
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-sm font-medium">{tag.name}</span>
                    <div className="flex items-center gap-1">
                      <button 
                        type="button" 
                        className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors" 
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <CircleX className="h-3 w-3" />
                      </button>
                    </div>
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