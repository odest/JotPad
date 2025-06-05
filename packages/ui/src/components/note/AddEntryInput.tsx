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
  bottomInputContainerRef: RefObject<HTMLDivElement | null>;
  NOTE_CONTENT_INPUT_HEIGHT: number;
}

export function AddEntryInput({
  newEntryText,
  setNewEntryText,
  handleKeyPress,
  handleAddEntry,
  newEntryInputRef,
  bottomInputContainerRef,
  NOTE_CONTENT_INPUT_HEIGHT
}: AddEntryInputProps) {
  const { t } = useTranslation();
  return (
    <div
      ref={bottomInputContainerRef}
      className="border-t p-4 shrink-0 sticky bottom-0 z-10 bg-background"
      style={{ height: NOTE_CONTENT_INPUT_HEIGHT, minHeight: NOTE_CONTENT_INPUT_HEIGHT }}
    >
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        <TextareaAutosize
          placeholder={t('add_new_note_entry')}
          className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 custom-scrollbar"
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
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}