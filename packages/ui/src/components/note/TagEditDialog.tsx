import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@repo/ui/components/dialog";
import { Badge } from "@repo/ui/components/badge";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Edit2, Trash2 } from "lucide-react";
import { TagWithColor } from "@repo/ui/lib/database";
import { ColorPicker } from "@repo/ui/components/note/ColorPicker";
import { TagSuggestions } from "@repo/ui/components/note/TagSuggestions";

interface TagEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: TagWithColor[];
  onUpdateTag: (oldName: string, newName: string, newColor: string) => Promise<void>;
  onDeleteTag: (tagName: string) => Promise<void>;
}

export function TagEditDialog({
  open,
  onOpenChange,
  tags,
  onUpdateTag,
  onDeleteTag,
}: TagEditDialogProps) {
  const { t } = useTranslation();
  const [editingTag, setEditingTag] = useState<TagWithColor | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#3b82f6");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!open) {
      setEditingTag(null);
      setEditName("");
      setEditColor("#3b82f6");
      setIsUpdating(false);
      setIsDeleting(null);
      setShowSuggestions(false);
    }
  }, [open]);

  const handleStartEdit = (tag: TagWithColor) => {
    setEditingTag(tag);
    setEditName(tag.name);
    setEditColor(tag.color);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditName("");
    setEditColor("#3b82f6");
    setShowSuggestions(false);
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditName(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSelectSuggestion = (tag: TagWithColor) => {
    setEditName(tag.name);
    setEditColor(tag.color);
    setShowSuggestions(false);
  };

  const handleSaveEdit = async () => {
    if (!editingTag || !editName.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdateTag(editingTag.name, editName.trim(), editColor);
      setEditingTag(null);
      setEditName("");
      setEditColor("#3b82f6");
      setShowSuggestions(false);
    } catch (error) {
      console.error('Failed to update tag:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTag = async (tagName: string) => {
    setIsDeleting(tagName);
    try {
      await onDeleteTag(tagName);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('manage_tags')}</DialogTitle>
          <DialogDescription>
            {t('manage_tags_desc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {tags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('no_tags_found')}
            </div>
          ) : (
            tags.map((tag) => (
              <div key={tag.name} className="flex items-center justify-between p-3 border rounded-lg">
                {editingTag?.name === tag.name ? (
                  <div className="flex items-center gap-2 flex-1">
                    <ColorPicker
                      color={editColor}
                      onColorChange={setEditColor}
                      className="shrink-0"
                    />
                    <div className="relative flex-1">
                      <Input
                        value={editName}
                        onChange={handleEditNameChange}
                        className="flex-1"
                        placeholder={t('enter_tags')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editName.trim()) {
                            handleSaveEdit();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        onFocus={() => setShowSuggestions(editName.trim().length > 0)}
                      />
                      <TagSuggestions
                        inputValue={editName}
                        allTags={tags}
                        onSelectTag={handleSelectSuggestion}
                        visible={showSuggestions}
                        onClose={() => setShowSuggestions(false)}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={!editName.trim() || isUpdating}
                    >
                      {isUpdating ? t('saving') : t('save')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <Badge 
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
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartEdit(tag)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTag(tag.name)}
                        disabled={isDeleting === tag.name}
                      >
                        {isDeleting === tag.name ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 