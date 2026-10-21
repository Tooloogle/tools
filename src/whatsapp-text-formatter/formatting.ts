import { html, type TemplateResult } from 'lit';

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

function renderInline(text: string): (string | TemplateResult)[] {
    const parts: (string | TemplateResult)[] = [];
    const tokens = /`([^`\n]+)`|\*((?:`[^`\n]+`|[^*\n`])+)\*|_((?:`[^`\n]+`|[^_\n`])+)_|~((?:`[^`\n]+`|[^~\n`])+)~/g;
    let previous = 0;
    for (const match of text.matchAll(tokens)) {
        parts.push(text.slice(previous, match.index));
        if (match[1]) {
            parts.push(html`<code>${match[1]}</code>`);
        } else if (match[2]) {
            parts.push(html`<strong>${renderInline(match[2])}</strong>`);
        } else if (match[3]) {
            parts.push(html`<em>${renderInline(match[3])}</em>`);
        } else {
            parts.push(html`<s>${renderInline(match[4])}</s>`);
        }

        previous = match.index + match[0].length;
    }

    parts.push(text.slice(previous));
    return parts;
}

export function renderMessagePreview(text: string) {
    const lines: { parts: (string | TemplateResult)[]; kind: string }[] = [{ parts: [], kind: '' }];
    for (const part of text.split(/(```[\s\S]*?```)/g)) {
        if (!part) {
            continue;
        }

        const code = part.startsWith('```') && part.endsWith('```');
        const fragments = (code ? part.slice(3, -3) : part).split('\n');
        fragments.forEach((fragment, index) => {
            if (index) {
                lines.push({ parts: [], kind: '' });
            }

            const line = lines[lines.length - 1];
            if (!code && !line.parts.length && /^(> |[-*] )/.test(fragment)) {
                line.kind = fragment.startsWith('> ') ? 'quote' : 'bullet';
                fragment = fragment.slice(2);
            }

            line.parts.push(...(code ? [html`<code class="preview-code">${fragment}</code>`] : renderInline(fragment)));
        });
    }

    return lines.map(line => {
        if (line.kind === 'quote') {
            return html`<blockquote>${line.parts}</blockquote>`;
        }

        return html`<div class=${line.kind === 'bullet' ? 'preview-bullet' : ''}>${line.parts}<br
            ?hidden=${line.parts.some(part => part !== '')} /></div>`;
    });
}