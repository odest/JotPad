import { useState, useEffect, RefObject } from "react";
import { NoteEntry } from "@repo/ui/lib/database";

export function useSearch(
  noteEntries: NoteEntry[],
  searchResultsContainerRef: RefObject<HTMLDivElement | null>
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [matches, setMatches] = useState<HTMLElement[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    setSearchQuery("");
    setIsSearchActive(false);
    setMatches([]);
    setCurrentMatchIndex(-1);
    setTotalMatches(0);
  }, [noteEntries]);

  useEffect(() => {
    const container = searchResultsContainerRef.current;

    if (isSearchActive && searchQuery.trim() && container) {
      if (currentMatchIndex !== -1 && matches[currentMatchIndex]) {
        matches[currentMatchIndex].classList.remove('active-match-highlight');
      }

      const highlightedElements = Array.from(
        container.querySelectorAll('.match-highlight')
      ) as HTMLElement[];
      
      setMatches(highlightedElements);
      setTotalMatches(highlightedElements.length);

      if (highlightedElements.length > 0) {
        setCurrentMatchIndex(0);
      } else {
        setCurrentMatchIndex(-1);
      }
    } else {
      if (currentMatchIndex !== -1 && matches.length > 0 && matches[currentMatchIndex]) {
        matches[currentMatchIndex].classList.remove('active-match-highlight');
      }
      setMatches([]);
      setTotalMatches(0);
      setCurrentMatchIndex(-1);
    }
  }, [searchQuery, isSearchActive, noteEntries, searchResultsContainerRef]);

  useEffect(() => {
    matches.forEach((match, index) => {
      if (index === currentMatchIndex) {
        match.classList.add('active-match-highlight');
        match.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      } else {
        match.classList.remove('active-match-highlight');
      }
    });
  }, [currentMatchIndex, matches]);

  const handleNavigateMatch = (direction: 'next' | 'prev') => {
    if (totalMatches === 0) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentMatchIndex + 1) % totalMatches;
    } else {
      nextIndex = (currentMatchIndex - 1 + totalMatches) % totalMatches;
    }
    setCurrentMatchIndex(nextIndex);
  };

  const filteredEntries = noteEntries.filter(entry =>
    entry.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    searchQuery,
    setSearchQuery,
    isSearchActive,
    setIsSearchActive,
    matches,
    currentMatchIndex,
    totalMatches,
    handleNavigateMatch,
    filteredEntries
  };
}