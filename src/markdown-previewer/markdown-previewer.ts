import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import markdownPreviewerStyles from './markdown-previewer.css.js';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../t-textarea';

@customElement('markdown-previewer')
export class MarkdownPreviewer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, markdownPreviewerStyles];

    @property()
    markdown = '# Hello Markdown!\n\n## Features\n\n- **Bold** and *italic* text\n- [Links](https://example.com)\n- `Code blocks`\n\n```javascript\nconst hello = "world";\n```\n\n> Blockquotes are supported too!';

    @property()
    preview = '';

    connectedCallback() {
        super.connectedCallback();
        this.updatePreview();
    }

    private handleMarkdownChange(e: CustomEvent) {
        this.markdown = e.detail.value;
        this.updatePreview();
    }

    private updatePreview() {
        this.preview = this.parseMarkdown(this.markdown);
    }

    private parseMarkdown(text: string): string {
        let html = text;

        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }

    override render() {
        return html`
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Markdown Input</span>
                    <t-textarea placeholder="Enter markdown here..." rows="15" class="font-mono" .value=${this.markdown} @t-input=${this.handleMarkdownChange}></t-textarea>
                </label>

                <div class="block">
                    <span class="inline-block py-1 font-bold">Preview</span>
                    <div class="border rounded p-4 bg-white min-h-[300px]" style="word-wrap: break-word;">
                        ${unsafeHTML(this.preview)}
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'markdown-previewer': MarkdownPreviewer;
    }
}
