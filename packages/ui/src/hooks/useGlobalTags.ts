import { useMemo } from "react";
import { TagWithColor } from "@repo/ui/lib/database";

export interface AppNote {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
  tags?: TagWithColor[];
  lastEntryText?: string | null;
}

export function useGlobalTags(notes: AppNote[]) {
  const allGlobalTags = useMemo(() => {
    const tagMap = new Map<string, TagWithColor>();
    
    notes.forEach(note => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach(tag => {
          if (!tagMap.has(tag.name) || (tag.color && !tagMap.get(tag.name)?.color)) {
            tagMap.set(tag.name, tag);
          }
        });
      }
    });

    return Array.from(tagMap.values());
  }, [notes]);

  const findExistingTag = (tagName: string): TagWithColor | null => {
    return allGlobalTags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase()) || null;
  };

  const getAllTagNames = (): string[] => {
    return allGlobalTags.map(tag => tag.name);
  };

  const tagExists = (tagName: string): boolean => {
    return allGlobalTags.some(tag => tag.name.toLowerCase() === tagName.toLowerCase());
  };

  const getTagColor = (tagName: string): string => {
    const existingTag = findExistingTag(tagName);
    return existingTag?.color || "#3b82f6";
  };

  return {
    allGlobalTags,
    findExistingTag,
    getAllTagNames,
    tagExists,
    getTagColor,
  };
} 