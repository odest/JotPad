import * as Sharing from 'expo-sharing';

import { type Entry, type Note, type Tag } from '@/data/notes-store';
import { en } from '@/i18n/en';

import { allNotesFileName, shareExport, type ExportData } from './export-notes';

// The files a test writes, by name, and the share sheet calls.
const mockWritten: Record<string, string> = {};

jest.mock('expo-file-system', () => ({
  Paths: { cache: 'cache' },
  File: class {
    uri: string;
    fileName: string;
    constructor(_dir: string, fileName: string) {
      this.fileName = fileName;
      this.uri = `file:///cache/${fileName}`;
    }
    create() {}
    write(content: string) {
      mockWritten[this.fileName] = content;
    }
  },
}));
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn().mockResolvedValue(undefined) }));
jest.mock('@/i18n', () => ({
  strings: () => jest.requireActual('@/i18n/en').en,
}));

const at = (d: number, h: number, min: number) => new Date(2026, 6, d, h, min).getTime();

const note: Note = {
  id: 'n1',
  title: 'Trip *plans*',
  createdAt: at(1, 9, 0),
  pinned: false,
  tagIds: ['t1', 't2'],
};
const tags: Tag[] = [
  { id: 't1', name: 'travel', color: 'blue' },
  { id: 't2', name: 'a_b', color: 'red' },
];
const entry = (
  id: string,
  body: string,
  createdAt: number,
  pinnedAt: number | null = null,
): Entry => ({
  id,
  noteId: 'n1',
  body,
  createdAt,
  pinnedAt,
});

const data: ExportData = {
  notes: [note],
  tags,
  entries: {
    n1: [
      entry('e1', 'first line\nsecond line', at(1, 9, 5)),
      entry('e2', '**bold** next day', at(2, 18, 30), at(2, 19, 0)),
    ],
  },
};

async function exportAs(format: 'markdown' | 'text' | 'json', input = data, name = 'My notes') {
  await shareExport(input, format, name);
  const extension = { markdown: 'md', text: 'txt', json: 'json' }[format];
  return mockWritten[`${name}.${extension}`];
}

beforeEach(() => {
  for (const key of Object.keys(mockWritten)) delete mockWritten[key];
  jest.clearAllMocks();
});

describe('Markdown export', () => {
  it('writes the title, tags, a heading per day and each message with its time', async () => {
    expect(await exportAs('markdown')).toBe(
      [
        '# Trip \\*plans\\*',
        '',
        'Tags: travel, a\\_b',
        '',
        '## 2026-07-01',
        '',
        '**09:05**  ',
        'first line  ',
        'second line',
        '',
        '',
        '## 2026-07-02',
        '',
        '**18:30** 📌  ',
        '**bold** next day',
        '',
        '',
      ].join('\n'),
    );
  });

  it('keeps a message as Markdown instead of escaping it', async () => {
    expect(await exportAs('markdown')).toContain('**bold** next day');
  });

  it('separates notes with a rule and ends with a newline', async () => {
    const second: Note = { ...note, id: 'n2', title: 'Second', tagIds: [] };
    const out = await exportAs('markdown', {
      ...data,
      notes: [note, second],
      entries: { ...data.entries, n2: [] },
    });
    expect(out).toContain('\n\n---\n\n# Second');
    expect(out.endsWith('\n')).toBe(true);
  });

  it('skips the tags line for an untagged note', async () => {
    const out = await exportAs('markdown', { ...data, notes: [{ ...note, tagIds: [] }] });
    expect(out).not.toContain('Tags:');
  });
});

describe('plain text export', () => {
  it('underlines the title and indents continuation lines under the time', async () => {
    const out = await exportAs('text');
    expect(out).toContain('Trip *plans*\n============');
    expect(out).toContain('  09:05  first line\n        second line');
    expect(out).toContain(`  18:30 (${en.export.pinnedMark})  **bold** next day`);
  });
});

describe('JSON export', () => {
  it('is valid JSON with the app, tags and entries', async () => {
    const parsed = JSON.parse(await exportAs('json'));
    expect(parsed.app).toBe('JotPad');
    expect(parsed.version).toBe(1);
    expect(parsed.tags).toEqual([
      { id: 't1', name: 'travel' },
      { id: 't2', name: 'a_b' },
    ]);
    expect(parsed.notes).toHaveLength(1);
    expect(parsed.notes[0].tagIds).toEqual(['t1', 't2']);
    expect(parsed.notes[0].entries.map((e: { body: string }) => e.body)).toEqual([
      'first line\nsecond line',
      '**bold** next day',
    ]);
  });

  it('writes the pin time only for pinned entries', async () => {
    const [first, second] = JSON.parse(await exportAs('json')).notes[0].entries;
    expect(first.pinnedAt).toBeNull();
    expect(second.pinnedAt).toBe(new Date(at(2, 19, 0)).toISOString());
  });
});

describe('shareExport', () => {
  it('opens the share sheet with the file and its type', async () => {
    await exportAs('markdown');
    expect(Sharing.shareAsync).toHaveBeenCalledWith('file:///cache/My notes.md', {
      mimeType: 'text/markdown',
      UTI: 'net.daringfireball.markdown',
      dialogTitle: en.export.shareTitle('My notes'),
    });
  });

  it('strips characters a file name cannot hold', async () => {
    await shareExport(data, 'text', 'a/b:c*"d"?');
    expect(Object.keys(mockWritten)).toEqual(['abcd.txt']);
  });

  it('falls back to "note" when nothing is left of the name', async () => {
    await shareExport(data, 'text', '///');
    expect(Object.keys(mockWritten)).toEqual(['note.txt']);
  });

  it('rejects when sharing fails, so the caller can show an error', async () => {
    (Sharing.shareAsync as jest.Mock).mockRejectedValueOnce(new Error('no space'));
    await expect(shareExport(data, 'json', 'x')).rejects.toThrow('no space');
  });
});

describe('allNotesFileName', () => {
  it('adds the date so repeated exports do not collide', () => {
    expect(allNotesFileName(en, new Date(2026, 6, 5).getTime())).toBe(
      `${en.export.allNotesFile} 2026-07-05`,
    );
  });
});
