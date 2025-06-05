import { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsSearchActive: (active: boolean) => void;
  currentMatchIndex: number;
  totalMatches: number;
  handleNavigateMatch: (direction: 'next' | 'prev') => void;
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  setIsSearchActive,
  currentMatchIndex,
  totalMatches,
  handleNavigateMatch
}: SearchBarProps) {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const closeSearchFromBar = () => {
    setIsSearchActive(false);
    setSearchQuery("");
  };

  return (
    <div className="sticky top-0 z-10 p-2 mb-3 bg-primary/5 backdrop-blur-md rounded-lg shadow-sm">
      <div className="flex items-center gap-2 px-1">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={t('search_in_entries')}
          className="flex-1 h-9 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {totalMatches > 0 && (
          <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums px-1">
            {currentMatchIndex + 1} / {totalMatches}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigateMatch('prev')}
          disabled={totalMatches === 0}
          className="shrink-0 h-9 w-9"
        >
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigateMatch('next')}
          disabled={totalMatches === 0}
          className="shrink-0 h-9 w-9"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeSearchFromBar}
          className="shrink-0 h-9 w-9"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}