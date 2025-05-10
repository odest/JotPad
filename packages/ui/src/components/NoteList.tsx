import React from "react";

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
}

interface NoteListProps {
  filteredNotes: Note[];
  selectedNote: Note | null;
  handleNoteSelect: (note: Note) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ filteredNotes, selectedNote, handleNoteSelect }) => {
  return (
    <div>
      {filteredNotes.map((note) => (
        <div
          key={note.id}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-t last:border-b ${
            selectedNote?.id === note.id ? "bg-[#f4f4f5] dark:bg-[#27272a]" : "hover:bg-[#f9f9fa] dark:hover:bg-[#18181a]"
          }`}
          onClick={() => handleNoteSelect(note)}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black dark:border-white font-bold text-lg">
            {note.title.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base truncate">{note.title}</span>
              <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                {note.content
                  ? new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
            <span className="text-sm text-gray-400 truncate">
              {note.content ? note.content : "No note content yet..."}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}; 