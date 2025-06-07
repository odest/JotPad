import { RefObject } from "react";
import { useTranslation } from 'react-i18next';
import { Send } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import TextareaAutosize from "react-textarea-autosize";

interface AddEntryInputProps {
  newEntryText: string;
  setNewEntryText: (text: string) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleAddEntry: () => void;
  newEntryInputRef: RefObject<HTMLTextAreaElement | null>;
}

export function AddEntryInput({
  newEntryText,
  setNewEntryText,
  handleKeyPress,
  handleAddEntry,
  newEntryInputRef,
}: AddEntryInputProps) {
  const { t } = useTranslation();
  return (
    <div className="shrink-0 p-4">
      <div className="relative flex w-full max-w-3xl mx-auto items-center gap-2 border rounded-xl bg-card p-3 shadow-md focus-within:ring-2 focus-within:ring-primary">
        <TextareaAutosize
          placeholder={t('add_new_note_entry')}
          className="flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none custom-scrollbar"
          value={newEntryText}
          onChange={(e) => setNewEntryText(e.target.value)}
          onKeyDown={handleKeyPress}
          ref={newEntryInputRef}
          minRows={1}
          maxRows={10}
        />
        <Button
          type="button"
          size="icon"
          onClick={handleAddEntry}
          disabled={!newEntryText.trim()}
          className="self-end" 
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}