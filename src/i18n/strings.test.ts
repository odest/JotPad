import { en } from './en';
import { tr } from './tr';

/** Every path to a string or a function in a strings object, like "notes.sortNewest". */
function leaves(value: unknown, prefix = ''): Record<string, unknown> {
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).reduce<Record<string, unknown>>(
      (all, [key, child]) => ({ ...all, ...leaves(child, prefix ? `${prefix}.${key}` : key) }),
      {},
    );
  }
  return { [prefix]: value };
}

const english = leaves(en);
const turkish = leaves(tr);

describe('UI strings', () => {
  it('have the same keys in English and Turkish', () => {
    expect(Object.keys(turkish).sort()).toEqual(Object.keys(english).sort());
  });

  it('use the same kind of value in both languages', () => {
    for (const [key, value] of Object.entries(english)) {
      expect(`${key}:${typeof turkish[key]}`).toBe(`${key}:${typeof value}`);
    }
  });

  it('have no empty text', () => {
    for (const [lang, all] of [
      ['en', english],
      ['tr', turkish],
    ] as const) {
      for (const [key, value] of Object.entries(all)) {
        if (typeof value === 'string')
          expect(`${lang}.${key}:${value.trim().length > 0}`).toBe(`${lang}.${key}:true`);
      }
    }
  });
});
