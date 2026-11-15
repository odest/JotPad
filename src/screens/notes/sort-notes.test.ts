import { type Note } from '@/data/notes-store';

import { sortNotes } from './sort-notes';

const note = (id: string, title: string, createdAt: number, pinned = false): Note => ({
  id,
  title,
  createdAt,
  pinned,
  tagIds: [],
});

// Given in the store's order: most recent activity first.
const NOTES = [
  note('a', 'banana', 20),
  note('b', 'Apple', 30),
  note('c', 'cherry 10', 10),
  note('d', 'cherry 2', 40),
];

const ids = (notes: Note[]) => notes.map((n) => n.id).join('');

describe('sortNotes', () => {
  it('keeps the store order for activity', () => {
    expect(ids(sortNotes(NOTES, 'activity'))).toBe('abcd');
  });

  it('orders by creation date', () => {
    expect(ids(sortNotes(NOTES, 'newest'))).toBe('dbac');
    expect(ids(sortNotes(NOTES, 'oldest'))).toBe('cabd');
  });

  it('orders titles without regard to case and with numbers as numbers', () => {
    expect(ids(sortNotes(NOTES, 'title-asc'))).toBe('badc');
    expect(ids(sortNotes(NOTES, 'title-desc'))).toBe('cdab');
  });

  it('puts pinned notes first in every order, keeping the order within each group', () => {
    const notes = [
      note('a', 'a', 1),
      note('b', 'b', 2, true),
      note('c', 'c', 3),
      note('d', 'd', 4, true),
    ];
    expect(ids(sortNotes(notes, 'activity'))).toBe('bdac');
    expect(ids(sortNotes(notes, 'newest'))).toBe('dbca');
    expect(ids(sortNotes(notes, 'title-desc'))).toBe('dbca');
  });

  it('does not change the list it is given', () => {
    const copy = [...NOTES];
    sortNotes(NOTES, 'title-asc');
    expect(NOTES).toEqual(copy);
  });

  it('handles an empty list', () => {
    expect(sortNotes([], 'newest')).toEqual([]);
  });
});
