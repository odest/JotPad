import React, { useState } from "react";
import { NoteEntry } from "@repo/ui/lib/database";
import { Button } from "@repo/ui/components/button";
import { PinOff, CornerDownRight, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from "@repo/ui/components/card";

interface PinnedEntriesListProps {
  pinnedEntries: NoteEntry[];
  onUnpin: (entryId: string) => void;
  onGoToEntry: (entryId: string) => void;
  isSearchActive?: boolean;
}

export const PinnedEntriesList: React.FC<PinnedEntriesListProps> = ({ 
  pinnedEntries, 
  onUnpin, 
  onGoToEntry, 
  isSearchActive = false 
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  if (pinnedEntries.length === 0) return null;
  return (
      <Card className={`sticky ${isSearchActive ? 'top-16' : 'top-0'} z-10 p-2 mb-3 gap-2 max-h-96`}>
        <CardHeader className="flex flex-row items-center justify-between py-2 px-3 cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
          <span className="text-base flex items-center gap-2">
            {t('pinned_entries')}
          </span>
          <Button size="icon" variant="ghost" tabIndex={-1} type="button">
            {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </CardHeader>
        {open && (
          <CardContent className="flex flex-col gap-2 pt-0 pb-2 px-2 overflow-y-auto max-h-64 custom-scrollbar">
            {pinnedEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-2 bg-background/80 rounded py-1 border hover:bg-muted cursor-pointer"
                onClick={() => onGoToEntry(entry.id)}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onGoToEntry(entry.id); }}
              >
                <span className="text-xs text-muted-foreground min-w-[48px] text-right">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex-1 truncate text-sm">{entry.text.length > 80 ? entry.text.slice(0, 80) + '...' : entry.text}</span>
                <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); onUnpin(entry.id); }}>
                  <PinOff className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); onGoToEntry(entry.id); }}>
                  <CornerDownRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
  );
}; 