const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

export function htmlToMarkdown(input: string): string {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  doc.querySelectorAll('script, style').forEach((el) => el.remove());
  return childrenToMarkdown(doc.body)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function childrenToMarkdown(node: Node): string {
  let out = '';
  node.childNodes.forEach((child) => {
    out += nodeToMarkdown(child);
  });
  return out;
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === TEXT_NODE) {
    return (node.textContent ?? '').replace(/\s+/g, ' ');
  }

  if (node.nodeType !== ELEMENT_NODE) {
    return '';
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const heading = tag.match(/^h([1-6])$/);

  if (heading) {
    return `\n\n${'#'.repeat(Number(heading[1]))} ${childrenToMarkdown(el).trim()}\n\n`;
  }

  return elementToMarkdown(el, tag);
}

// eslint-disable-next-line complexity
function elementToMarkdown(el: HTMLElement, tag: string): string {
  switch (tag) {
    case 'strong':
    case 'b':
      return `**${childrenToMarkdown(el)}**`;
    case 'em':
    case 'i':
      return `*${childrenToMarkdown(el)}*`;
    case 'code':
      return `\`${el.textContent ?? ''}\``;
    case 'pre':
      return `\n\n\`\`\`\n${(el.textContent ?? '').replace(/\n+$/, '')}\n\`\`\`\n\n`;
    case 'a':
      return anchorToMarkdown(el);
    case 'img':
      return imageToMarkdown(el);
    case 'br':
      return '\n';
    case 'hr':
      return '\n\n---\n\n';
    case 'blockquote':
      return `\n\n${blockquote(childrenToMarkdown(el))}\n\n`;
    case 'p':
      return `\n\n${childrenToMarkdown(el).trim()}\n\n`;
    case 'ul':
      return `\n${list(el, false)}\n`;
    case 'ol':
      return `\n${list(el, true)}\n`;
    default:
      return childrenToMarkdown(el);
  }
}

function anchorToMarkdown(el: HTMLElement): string {
  const href = el.getAttribute('href') ?? '';
  const text = childrenToMarkdown(el).trim();
  return href ? `[${text}](${href})` : text;
}

function imageToMarkdown(el: HTMLElement): string {
  const src = el.getAttribute('src') ?? '';
  const alt = el.getAttribute('alt') ?? '';
  return src ? `![${alt}](${src})` : '';
}

function list(el: HTMLElement, ordered: boolean): string {
  const items = Array.from(el.children).filter(
    (child) => child.tagName.toLowerCase() === 'li'
  );
  return items
    .map((li, index) => {
      const marker = ordered ? `${index + 1}.` : '-';
      const content = childrenToMarkdown(li).trim();
      return `${marker} ${content}`;
    })
    .join('\n');
}

function blockquote(content: string): string {
  return content
    .trim()
    .split('\n')
    .map((line) => `> ${line}`.trimEnd())
    .join('\n');
}
