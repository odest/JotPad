import { groupPosition } from './group-position';

describe('groupPosition', () => {
  it('is "only" for a group of one', () => {
    expect(groupPosition(0, 1)).toBe('only');
  });

  it('marks the ends and the middle of a longer group', () => {
    expect(groupPosition(0, 3)).toBe('first');
    expect(groupPosition(1, 3)).toBe('middle');
    expect(groupPosition(2, 3)).toBe('last');
  });

  it('has no middle in a group of two', () => {
    expect(groupPosition(0, 2)).toBe('first');
    expect(groupPosition(1, 2)).toBe('last');
  });
});
