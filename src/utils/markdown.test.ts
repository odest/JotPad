import { hasMarkdown, stripMarkdown, withLineBreaks } from './markdown';

describe('hasMarkdown', () => {
  it.each([
    ['**bold**'],
    ['_italic_'],
    ['`code`'],
    ['~~gone~~'],
    ['# heading'],
    ['> quote'],
    ['[link](https://example.com)'],
    ['- item'],
    ['+ item'],
    ['1. first'],
    ['text\n- item on a later line'],
  ])('detects %j', (text) => {
    expect(hasMarkdown(text)).toBe(true);
  });

  it.each([['hello world'], ['two\nplain lines'], ['3 - 2'], ['1.5 liters'], ['']])(
    'leaves %j as plain text',
    (text) => {
      expect(hasMarkdown(text)).toBe(false);
    },
  );
});

describe('withLineBreaks', () => {
  it('turns a line break between two lines into a hard break', () => {
    expect(withLineBreaks('one\ntwo')).toBe('one  \ntwo');
  });

  it('keeps a blank line as a paragraph break', () => {
    expect(withLineBreaks('one\n\ntwo')).toBe('one\n\ntwo');
  });

  it('does not add a break after the last line', () => {
    expect(withLineBreaks('one\ntwo\nthree')).toBe('one  \ntwo  \nthree');
  });

  it('leaves a single line alone', () => {
    expect(withLineBreaks('just one')).toBe('just one');
  });

  it('leaves the lines of a code block alone, fences included', () => {
    const text = 'before\n```\nconst a = 1;\nconst b = 2;\n```\nafter';
    expect(withLineBreaks(text)).toBe('before  \n```\nconst a = 1;\nconst b = 2;\n```\nafter');
  });

  it('handles tilde fences', () => {
    expect(withLineBreaks('~~~\na\nb\n~~~')).toBe('~~~\na\nb\n~~~');
  });
});

describe('stripMarkdown', () => {
  it('removes emphasis, strikethrough and code markers', () => {
    expect(stripMarkdown('**bold** and _italic_ and ~~gone~~ and `code`')).toBe(
      'bold and italic and gone and code',
    );
  });

  it('removes heading, quote, bullet and number markers', () => {
    expect(stripMarkdown('# Title\n> quoted\n- item\n1. first')).toBe('Title quoted item first');
  });

  it('removes task boxes', () => {
    expect(stripMarkdown('- [ ] todo\n- [x] done')).toBe('todo done');
  });

  it('keeps the text of links and images', () => {
    expect(stripMarkdown('see [Expo](https://expo.dev) and ![logo](a.png)')).toBe(
      'see Expo and logo',
    );
  });

  it('drops code fences but keeps the code', () => {
    expect(stripMarkdown('```\nconst x = 1;\nlog(x)\n```')).toBe('const x = 1; log(x)');
  });

  it('joins lines and collapses whitespace', () => {
    expect(stripMarkdown('  one \n\n  two   three ')).toBe('one two three');
  });

  it('does not eat underscores inside words', () => {
    expect(stripMarkdown('snake_case_name')).toBe('snake_case_name');
  });

  it('does not treat a multiplication sign as emphasis', () => {
    expect(stripMarkdown('2 * 3 * 4')).toBe('2 * 3 * 4');
  });

  it('returns an empty string for empty input', () => {
    expect(stripMarkdown('')).toBe('');
  });
});
