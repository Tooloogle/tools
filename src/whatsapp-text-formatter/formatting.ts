import { html } from 'lit';

export interface TextSelection {
    text: string;
    start: number;
    end: number;
}

const MARKERS: Record<string, string> = { bold: '*', italic: '_', strike: '~', monospace: '```', code: '`' };

function formatLines(selection: TextSelection, command: string): TextSelection {
    const { text, start, end } = selection;
    const first = start === 0 ? 0 : text.lastIndexOf('\n', start - 1) + 1;
    const lastSelected = end > start && text[end - 1] === '\n' ? end - 1 : end;
    const newline = text.indexOf('\n', lastSelected);
    const last = newline < 0 ? text.length : newline;
    const lines = text.slice(first, last).split('\n');
    const pattern = command === 'bullet' ? /^- / : command === 'quote' ? /^> / : /^\d+\. /;
    const remove = lines.every(line => pattern.test(line));
    const formatted = lines.map((line, index) => {
        const content = line.replace(pattern, '');
        if (remove) {
            return content;
        }

        const prefix = command === 'bullet' ? '- ' : command === 'quote' ? '> ' : `${index + 1}. `;
        return prefix + content;
    }).join('\n');
    return { text: text.slice(0, first) + formatted + text.slice(last), start: first, end: first + formatted.length };
}

export function formatSelection(selection: TextSelection, command: string): TextSelection {
    const marker = MARKERS[command];
    if (!marker) {
        return formatLines(selection, command);
    }

    const { text, start, end } = selection;
    const selected = text.slice(start, end);
    if (selected.startsWith(marker) && selected.endsWith(marker) && selected.length >= marker.length * 2) {
        const content = selected.slice(marker.length, -marker.length);
        return { text: text.slice(0, start) + content + text.slice(end), start, end: start + content.length };
    }

    const wrapped = marker + selected + marker;
    const caret = start + marker.length;
    return { text: text.slice(0, start) + wrapped + text.slice(end), start: start === end ? caret : start,
        end: start === end ? caret : start + wrapped.length };
}

function renderInline(text: string) {
    const parts = [];
    const tokens = /`([^`\n]+)`|\*([^*\n]+)\*|_([^_\n]+)_|~([^~\n]+)~/g;
    let previous = 0;
    for (const match of text.matchAll(tokens)) {
        parts.push(text.slice(previous, match.index));
        if (match[1]) {
            parts.push(html`<code>${match[1]}</code>`);
        } else if (match[2]) {
            parts.push(html`<strong>${match[2]}</strong>`);
        } else if (match[3]) {
            parts.push(html`<em>${match[3]}</em>`);
        } else {
            parts.push(html`<s>${match[4]}</s>`);
        }

        previous = match.index + match[0].length;
    }

    parts.push(text.slice(previous));
    return parts;
}

function renderLine(line: string) {
    if (line.startsWith('> ')) {
        return html`<blockquote>${renderInline(line.slice(2))}</blockquote>`;
    }

    if (/^[-*] /.test(line)) {
        return html`<div class="preview-bullet">${renderInline(line.slice(2))}</div>`;
    }

    return html`<div>${renderInline(line) || ''}<br ?hidden=${!!line} /></div>`;
}

export function renderMessagePreview(text: string) {
    return text.split(/(```[\s\S]*?```)/g).map(part => {
        if (part.startsWith('```') && part.endsWith('```')) {
            return html`<code class="preview-code">${part.slice(3, -3)}</code>`;
        }

        return part ? part.split('\n').map(renderLine) : '';
    });
}