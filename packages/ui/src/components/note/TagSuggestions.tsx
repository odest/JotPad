import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Badge } from "@repo/ui/components/badge";
import { TagWithColor } from "@repo/ui/lib/database";

interface TagSuggestionsProps {
  inputValue: string;
  allTags: TagWithColor[];
  onSelectTag: (tag: TagWithColor) => void;
  visible: boolean;
  onClose: () => void;
}

export function TagSuggestions({
  inputValue,
  allTags,
  onSelectTag,
  visible,
  onClose,
}: TagSuggestionsProps) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTags = allTags.filter(tag =>
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    tag.name.toLowerCase() !== inputValue.toLowerCase()
  ).slice(0, 5);

  useEffect(() => {
    setSelectedIndex(0);
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible || filteredTags.length === 0 || !inputValue.trim()) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto custom-scrollbar"
    >
      {filteredTags.map((tag, index) => (
        <div
          key={tag.name}
          className={`px-3 py-2 cursor-pointer hover:bg-accent transition-colors ${
            index === selectedIndex ? 'bg-accent' : ''
          }`}
          onClick={() => onSelectTag(tag)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="rounded-md py-1 px-2 gap-2 items-center border-2 text-xs"
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
              <span className="text-xs font-medium">{tag.name}</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t('existing_tag')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 