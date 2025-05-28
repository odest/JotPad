import { db, Note, NoteEntry } from "@repo/ui/lib/database";

export type ExportFormat = "json" | "txt" | "md";

function formatNoteWithEntries(note: Note & { entries: NoteEntry[] }, format: ExportFormat): string {
  if (format === "json") {
    return JSON.stringify(note, null, 2);
  } else if (format === "txt") {
    const entriesStr = note.entries.map(entry => `  - [${entry.timestamp}] ${entry.text}`).join("\n");
    return `Title: ${note.title}\nCreated: ${note.created_at}\nUpdated: ${note.updated_at}\nEntries:\n${entriesStr}`;
  } else if (format === "md") {
    const entriesStr = note.entries.map(entry => `- **${new Date(entry.timestamp).toLocaleString()}**: ${entry.text}`).join("\n");
    return `# ${note.title}\n\n*Created: ${note.created_at}*\n*Updated: ${note.updated_at}*\n\n## Messages\n${entriesStr}`;
  }
  return "";
}

function getMimeTypeAndExtension(format: ExportFormat) {
  if (format === "json") return { mimeType: "application/json", ext: "json" };
  if (format === "txt") return { mimeType: "text/plain", ext: "txt" };
  if (format === "md") return { mimeType: "text/markdown", ext: "md" };
  return { mimeType: "application/octet-stream", ext: "txt" };
}

export async function exportAllNotes(format: ExportFormat) {
  const notes: Note[] = await db.getNotes();
  const notesWithEntries = await Promise.all(
    notes.map(async (note) => {
      const entries = await db.getNoteEntries(note.id);
      return { ...note, entries };
    })
  );

  let dataStr = "";
  if (format === "json") {
    dataStr = JSON.stringify(notesWithEntries, null, 2);
  } else if (format === "txt") {
    dataStr = notesWithEntries.map(note => {
      const entriesStr = note.entries.map(entry => `  - [${entry.timestamp}] ${entry.text}`).join("\n");
      return `Title: ${note.title}\nCreated: ${note.created_at}\nUpdated: ${note.updated_at}\nEntries:\n${entriesStr}\n\n---`;
    }).join("\n\n");
  } else if (format === "md") {
    dataStr = notesWithEntries.map(note => {
      const entriesStr = note.entries.map(entry => `- **${new Date(entry.timestamp).toLocaleString()}**: ${entry.text}`).join("\n");
      return `# ${note.title}\n\n*Created: ${note.created_at}*\n*Updated: ${note.updated_at}*\n\n## Messages\n${entriesStr}\n\n---`;
    }).join("\n\n");
  }

  const { mimeType, ext } = getMimeTypeAndExtension(format);
  triggerDownload(dataStr, `notes_export.${ext}`, mimeType);
}

export async function exportSingleNote(note: Note, format: ExportFormat) {
  const entries = await db.getNoteEntries(note.id);
  const noteWithEntries = { ...note, entries };
  const dataStr = formatNoteWithEntries(noteWithEntries, format);
  const { mimeType, ext } = getMimeTypeAndExtension(format);
  triggerDownload(dataStr, `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.${ext}`, mimeType);
}

function triggerDownload(data: string, filename: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
} 