/**
 * Lightweight markdown-to-HTML parser.
 * Supports: headings, bold, italic, links, inline code, code blocks,
 * blockquotes, unordered lists, paragraphs, and line breaks.
 */
// eslint-disable-next-line max-lines-per-function
export function markdownToHtml(text: string): string {
  // Escape HTML to prevent XSS
  let result = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Code blocks — extract to placeholders to avoid transforms inside them
  const codeBlocks: string[] = [];
  result = result.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_match, _lang, code) => {
      const index = codeBlocks.length;
      codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
      return `%%CODEBLOCK_${index}%%`;
    }
  );

  // Inline code — extract to placeholders
  const inlineCodes: string[] = [];
  result = result.replace(/`([^`]+)`/g, (_match, code) => {
    const index = inlineCodes.length;
    inlineCodes.push(`<code>${code}</code>`);
    return `%%INLINECODE_${index}%%`;
  });

  // Headers
  result = result.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  result = result.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  result = result.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  result = result.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Horizontal rule
  result = result.replace(/^---$/gim, '<hr>');

  // Bold
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.*?)_/g, '<em>$1</em>');

  // Links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label, url) => {
      const safeUrl = sanitizeUrl(url);
      if (!safeUrl) {
        return label;
      }

      return `<a href="${safeUrl}" target="_blank" rel="noopener nofollow noreferrer">${label}</a>`;
    }
  );

  // Blockquotes (merge consecutive lines)
  result = result.replace(/^(&gt; .+\n?)+/gim, (block) => {
    const content = block
      .replace(/^&gt; /gm, '')
      .replace(/\n$/, '')
      .replace(/\n/g, '<br>');
    return `<blockquote>${content}</blockquote>\n`;
  });

  // Lists — unordered, ordered, and nested via indentation
  result = result.replace(
    /(?:^[ \t]*(?:[*-]|\d+\.) .+\n?)+/gim,
    (block) => renderList(block)
  );

  // Paragraphs (double newline)
  result = result.replace(/\n\n/g, '</p><p>');

  // Line breaks (single newline)
  result = result.replace(/\n/g, '<br>');

  // Wrap in paragraph
  result = `<p>${result}</p>`;

  // Clean up empty paragraphs and unwrap block elements
  result = result.replace(/<p><\/p>/g, '');
  result = result.replace(
    /<p>(<(?:h[1-6]|ul|ol|blockquote|pre|hr))/g,
    '$1'
  );
  result = result.replace(
    /(<\/(?:h[1-6]|ul|ol|blockquote|pre)>)<\/p>/g,
    '$1'
  );
  result = result.replace(/<hr><\/p>/g, '<hr>');

  // Restore code blocks before final cleanup so <pre> is never nested in <p>
  codeBlocks.forEach((block, i) => {
    result = result.replace(`%%CODEBLOCK_${i}%%`, block);
  });

  // Unwrap any <pre> that ended up inside <p> after restoration
  result = result.replace(/<p>(<pre[\s>])/g, '$1');
  result = result.replace(/(<\/pre>)<\/p>/g, '$1');

  // Restore inline codes
  inlineCodes.forEach((code, i) => {
    result = result.replace(`%%INLINECODE_${i}%%`, code);
  });

  return result;
}

function sanitizeUrl(url: string): string {
  const decoded = url.trim();
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(decoded)) {
    return decoded;
  }

  return '';
}

interface ListLine {
  indent: number;
  ordered: boolean;
  content: string;
}

function renderList(block: string): string {
  const lines: ListLine[] = block
    .replace(/\n$/, '')
    .split('\n')
    .map((line) => {
      const match = line.match(/^([ \t]*)([*-]|\d+\.)\s+(.*)$/);
      return {
        indent: match ? match[1].length : 0,
        ordered: match ? /\d/.test(match[2]) : false,
        content: match ? match[3] : line.trim(),
      };
    });

  let index = 0;

  const buildRun = (level: number): string => {
    const ordered = lines[index].ordered;
    const tag = ordered ? 'ol' : 'ul';
    let items = '';

    while (
      index < lines.length &&
      lines[index].indent === level &&
      lines[index].ordered === ordered
    ) {
      let content = lines[index].content;
      index++;

      if (index < lines.length && lines[index].indent > level) {
        content += buildLevel(lines[index].indent);
      }

      items += `<li>${content}</li>`;
    }

    return `<${tag}>${items}</${tag}>`;
  };

  const buildLevel = (level: number): string => {
    let out = '';
    while (index < lines.length && lines[index].indent === level) {
      out += buildRun(level);
    }

    return out;
  };

  return `${buildLevel(lines[0].indent)}\n`;
}
