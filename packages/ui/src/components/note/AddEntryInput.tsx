import { RefObject } from "react";
import { Send } from "lucide-react";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

interface AddEntryInputProps {
  newEntryText: string;
  setNewEntryText: (text: string) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleAddEntry: () => void;
  newEntryInputRef: RefObject<HTMLInputElement | null>;
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
  return (
    <div
      ref={bottomInputContainerRef}
      className="border-t p-4 shrink-0 sticky bottom-0 z-10 bg-background"
      style={{ height: NOTE_CONTENT_INPUT_HEIGHT, minHeight: NOTE_CONTENT_INPUT_HEIGHT }}
    >
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        <Input
          type="text"
          placeholder="Add a new note entry..."
          className="flex-1"
          value={newEntryText}
          onChange={(e) => setNewEntryText(e.target.value)}
          onKeyDown={handleKeyPress}
          ref={newEntryInputRef}
        />
        <Button
          type="button"
          size="icon"
          onClick={handleAddEntry}
          disabled={!newEntryText.trim()}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Add entry</span>
        </Button>
      </div>
    </div>
  );
}