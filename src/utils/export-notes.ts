import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { type Entry, type Note, type Tag } from '@/data/notes-store';
import { t } from '@/i18n';

export type ExportFormat = 'markdown' | 'text' | 'json';

/** What an export covers: the notes, their entries and the tags they use. */
export type ExportData = {
  notes: Note[];
  entries: Record<string, Entry[]>;
  tags: Tag[];
};

const FORMATS: Record<ExportFormat, { extension: string; mimeType: string; UTI: string }> = {
  markdown: { extension: 'md', mimeType: 'text/markdown', UTI: 'net.daringfireball.markdown' },
  text: { extension: 'txt', mimeType: 'text/plain', UTI: 'public.plain-text' },
  json: { extension: 'json', mimeType: 'application/json', UTI: 'public.json' },
};

const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-11-15", independent of the device locale so exports sort and read the same. */
function isoDay(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function clock(timestamp: number): string {
  const d = new Date(timestamp);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Entries grouped by calendar day, oldest first. */
function byDay(entries: Entry[]): [string, Entry[]][] {
  const days = new Map<string, Entry[]>();
  for (const entry of entries) {
    const day = isoDay(entry.createdAt);
    days.set(day, [...(days.get(day) ?? []), entry]);
  }
  return [...days];
}

function tagNames(note: Note, tags: Tag[]): string[] {
  return note.tagIds.flatMap((id) => tags.find((tag) => tag.id === id)?.name ?? []);
}

/**
 * Keeps characters in a message from being read as Markdown syntax. Only the inline
 * markers are escaped: each message sits after a list marker and a time, so line-start
 * syntax (#, -, 1.) cannot take effect, and the raw file stays readable.
 */
function escapeMarkdown(text: string): string {
  return text.replace(/([\\`*_[\]<>])/g, '\\$1');
}

function toMarkdown({ notes, entries, tags }: ExportData): string {
  return notes
    .map((note) => {
      const lines = [`# ${escapeMarkdown(note.title)}`];
      const names = tagNames(note, tags);
      if (names.length > 0)
        lines.push('', `${t.export.tagsLine}: ${names.map(escapeMarkdown).join(', ')}`);
      for (const [day, list] of byDay(entries[note.id] ?? [])) {
        lines.push('', `## ${day}`, '');
        for (const entry of list) {
          const pin = entry.pinnedAt !== null ? ' 📌' : '';
          // Later lines of a multi-line message stay inside its list item, and a line
          // that starts like a heading, list or quote is kept as plain text.
          const body = escapeMarkdown(entry.body)
            .split('\n')
            .map((line, i) =>
              i === 0
                ? line
                : line.replace(/^(\s*)([#>+-])/, '$1\\$2').replace(/^(\s*\d+)\./, '$1\\.'),
            )
            .join('  \n  ');
          lines.push(`- **${clock(entry.createdAt)}**${pin} ${body}`);
        }
      }
      return lines.join('\n');
    })
    .join('\n\n---\n\n')
    .concat('\n');
}

function toText({ notes, entries, tags }: ExportData): string {
  return notes
    .map((note) => {
      const lines = [note.title, '='.repeat(Math.max(note.title.length, 3))];
      const names = tagNames(note, tags);
      if (names.length > 0) lines.push(`${t.export.tagsLine}: ${names.join(', ')}`);
      for (const [day, list] of byDay(entries[note.id] ?? [])) {
        lines.push('', day);
        for (const entry of list) {
          const pin = entry.pinnedAt !== null ? ` (${t.export.pinnedMark})` : '';
          const body = entry.body.replace(/\n/g, '\n        ');
          lines.push(`  ${clock(entry.createdAt)}${pin}  ${body}`);
        }
      }
      return lines.join('\n');
    })
    .join('\n\n\n')
    .concat('\n');
}

function toJson({ notes, entries, tags }: ExportData): string {
  const iso = (timestamp: number) => new Date(timestamp).toISOString();
  return JSON.stringify(
    {
      app: 'JotPad',
      version: 1,
      exportedAt: iso(Date.now()),
      tags: tags.map((tag) => ({ id: tag.id, name: tag.name })),
      notes: notes.map((note) => ({
        id: note.id,
        title: note.title,
        createdAt: iso(note.createdAt),
        pinned: note.pinned,
        tagIds: note.tagIds,
        entries: (entries[note.id] ?? []).map((entry) => ({
          id: entry.id,
          body: entry.body,
          createdAt: iso(entry.createdAt),
          pinnedAt: entry.pinnedAt === null ? null : iso(entry.pinnedAt),
        })),
      })),
    },
    null,
    2,
  );
}

const RENDERERS: Record<ExportFormat, (data: ExportData) => string> = {
  markdown: toMarkdown,
  text: toText,
  json: toJson,
};

/** A file name every platform accepts: no path separators or reserved characters. */
function safeFileName(name: string): string {
  const cleaned = name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return cleaned || 'note';
}

/**
 * Writes the notes to a file in the cache and opens the system share sheet with it, so
 * it can be saved to Files or Drive, or sent to another app.
 */
export async function shareExport(data: ExportData, format: ExportFormat, name: string) {
  const { extension, mimeType, UTI } = FORMATS[format];
  const file = new File(Paths.cache, `${safeFileName(name)}.${extension}`);
  file.create({ overwrite: true });
  file.write(RENDERERS[format](data));
  await Sharing.shareAsync(file.uri, { mimeType, UTI, dialogTitle: t.export.shareTitle(name) });
}

/** File name for an export of every note, dated so repeated exports do not collide. */
export function allNotesFileName(now = Date.now()): string {
  return `${t.export.allNotesFile} ${isoDay(now)}`;
}
