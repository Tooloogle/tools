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

  // Unordered lists (merge consecutive list items)
  result = result.replace(/(^[*-] .+\n?)+/gim, (block) => {
    const items = block
      .trim()
      .split('\n')
      .map((line) => line.replace(/^[*-] /, ''))
      .map((item) => `<li>${item}</li>`)
      .join('');
    return `<ul>${items}</ul>\n`;
  });

  // Ordered lists (merge consecutive numbered items)
  result = result.replace(/(^\d+\. .+\n?)+/gim, (block) => {
    const items = block
      .trim()
      .split('\n')
      .map((line) => line.replace(/^\d+\. /, ''))
      .map((item) => `<li>${item}</li>`)
      .join('');
    return `<ol>${items}</ol>\n`;
  });

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
