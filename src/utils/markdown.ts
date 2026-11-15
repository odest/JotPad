const FENCE = /^\s*(```|~~~)/;

/** True when the text has a character that could start Markdown formatting. */
export function hasMarkdown(text: string): boolean {
  return /[*_`~#>[\]|]|^\s*([-+]|\d+\.)\s/m.test(text);
}

/**
 * Makes each line break a break, as in a chat, instead of joining the lines into one
 * paragraph as Markdown does. Lines inside code blocks are left alone.
 */
export function withLineBreaks(text: string): string {
  const lines = text.split('\n');
  let inCode = false;
  return lines
    .map((line, i) => {
      if (FENCE.test(line)) {
        inCode = !inCode;
        return line;
      }
      const next = lines[i + 1];
      const breaks = !inCode && line.trim() !== '' && next !== undefined && next.trim() !== '';
      return breaks ? `${line}  ` : line;
    })
    .join('\n');
}

/** The text without Markdown markers, for one-line previews. */
export function stripMarkdown(text: string): string {
  return (
    text
      .split('\n')
      .filter((line) => !FENCE.test(line))
      // Line markers: headings, quotes, list bullets and numbers, task boxes.
      .map((line) => line.replace(/^\s*(#{1,6}\s+|>\s?|[-+*]\s+(\[[ xX]\]\s+)?|\d+\.\s+)/, ''))
      .join(' ')
      // Links and images keep their text.
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Emphasis, strikethrough and code markers.
      .replace(/(\*\*|__|~~|`)(.+?)\1/g, '$2')
      .replace(/(^|[^\w*])[*_]([^*_\s][^*_]*?)[*_](?!\w)/g, '$1$2')
      .replace(/\s+/g, ' ')
      .trim()
  );
}
