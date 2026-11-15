import { type ReactNode } from 'react';
import { Linking, Platform, Text, useColorScheme, View, type TextStyle } from 'react-native';
import { Renderer, useMarkdown, type MarkedStyles } from 'react-native-marked';

import { useT } from '@/i18n';
import { typeRamp, usePalette, type Palette } from '@/theme';
import { hasMarkdown, withLineBreaks } from '@/utils/markdown';

const MONOSPACE = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** Splits `body` around each case-insensitive occurrence of `query`. */
function splitMatches(body: string, query: string): { text: string; match: boolean }[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [{ text: body, match: false }];
  const haystack = body.toLocaleLowerCase();
  const parts: { text: string; match: boolean }[] = [];
  let from = 0;
  for (let at = haystack.indexOf(needle); at !== -1; at = haystack.indexOf(needle, from)) {
    if (at > from) parts.push({ text: body.slice(from, at), match: false });
    parts.push({ text: body.slice(at, at + needle.length), match: true });
    from = at + needle.length;
  }
  if (from < body.length) parts.push({ text: body.slice(from), match: false });
  return parts;
}

/** A faint layer of the text color, for code on the bubble's own color. */
function tint(color: string, alpha: string): string {
  return /^#[0-9a-f]{6}$/i.test(color) ? `${color}${alpha}` : color;
}

/** Markdown sized and colored for a message bubble instead of a document page. */
function bubbleStyles(palette: Palette): MarkedStyles {
  const color = palette['on-primary-container'];
  const text: TextStyle = {
    fontSize: typeRamp.body.size,
    lineHeight: typeRamp.body.leading,
    color,
  };
  const heading = (size: number, leading: number): TextStyle => ({
    ...text,
    fontSize: size,
    lineHeight: leading,
    fontWeight: '700',
    marginVertical: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  });
  const code = tint(color, '1F');
  return {
    text,
    em: { ...text, fontStyle: 'italic' },
    strong: { ...text, fontWeight: '700' },
    strikethrough: { ...text, textDecorationLine: 'line-through' },
    link: { ...text, fontStyle: 'normal', textDecorationLine: 'underline' },
    paragraph: { paddingVertical: 0 },
    h1: heading(typeRamp.body.size + 6, typeRamp.body.leading + 6),
    h2: heading(typeRamp.body.size + 4, typeRamp.body.leading + 4),
    h3: heading(typeRamp.body.size + 2, typeRamp.body.leading + 2),
    h4: heading(typeRamp.body.size, typeRamp.body.leading),
    h5: heading(typeRamp.body.size, typeRamp.body.leading),
    h6: heading(typeRamp.body.size, typeRamp.body.leading),
    codespan: {
      ...text,
      fontFamily: MONOSPACE,
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: typeRamp.body.size - 2,
      backgroundColor: code,
    },
    code: { padding: 8, borderRadius: 8, backgroundColor: code, minWidth: 0 },
    codeText: { ...text, fontFamily: MONOSPACE, fontSize: typeRamp.body.size - 2 },
    blockquote: { borderLeftColor: color, borderLeftWidth: 3, paddingLeft: 8, opacity: 0.85 },
    hr: { borderBottomColor: tint(color, '4D'), marginVertical: 4 },
    li: text,
    table: { borderColor: tint(color, '4D') },
  };
}

/**
 * Links that open on a tap but leave a long press to the message, so holding a link
 * opens the message's actions like anywhere else on the bubble.
 */
class BubbleRenderer extends Renderer {
  private links = 0;

  constructor(
    private readonly onLongPress: () => void,
    private readonly linkHint: string,
  ) {
    super({ selectable: false });
  }

  link(children: string | ReactNode[], href: string, styles?: TextStyle): ReactNode {
    return (
      <Text
        key={`link-${this.links++}`}
        accessibilityRole="link"
        accessibilityHint={this.linkHint}
        onPress={() => Linking.openURL(href).catch(() => {})}
        onLongPress={this.onLongPress}
        style={styles}
      >
        {children}
      </Text>
    );
  }
}

function MarkdownBody({ body, onLongPress }: { body: string; onLongPress: () => void }) {
  const t = useT();
  const palette = usePalette();
  const elements = useMarkdown(withLineBreaks(body), {
    renderer: new BubbleRenderer(onLongPress, t.note.openLink),
    colorScheme: useColorScheme() ?? undefined,
    styles: bubbleStyles(palette),
    theme: {
      colors: {
        text: palette['on-primary-container'],
        link: palette['on-primary-container'],
        code: tint(palette['on-primary-container'], '1F'),
        border: tint(palette['on-primary-container'], '4D'),
      },
    },
  });
  // Each block gets its own view: a list renders its items as siblings, and the gap
  // belongs between blocks, not between list items.
  return (
    <View style={{ gap: 6 }}>
      {elements.map((element, i) => (
        <View key={i}>{element}</View>
      ))}
    </View>
  );
}

/**
 * The text of a message: Markdown when it has any, plain text otherwise. While searching
 * it shows the raw text, so every match can be marked where it is.
 */
export function MessageBody({
  body,
  query = '',
  onLongPress,
}: {
  body: string;
  query?: string;
  onLongPress: () => void;
}) {
  const palette = usePalette();

  if (query.trim() || !hasMarkdown(body)) {
    return (
      <Text className="text-body text-on-primary-container">
        {splitMatches(body, query).map((part, i) =>
          part.match ? (
            <Text
              key={i}
              style={{ backgroundColor: palette.primary, color: palette['on-primary'] }}
            >
              {part.text}
            </Text>
          ) : (
            part.text
          ),
        )}
      </Text>
    );
  }
  return <MarkdownBody body={body} onLongPress={onLongPress} />;
}
