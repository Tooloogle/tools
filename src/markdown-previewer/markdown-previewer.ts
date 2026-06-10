import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import markdownPreviewerStyles from './markdown-previewer.css.js';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { markdownToHtml } from '../_utils/MarkdownParser.js';
import '../t-copy-button/index.js';

@customElement('markdown-previewer')
export class MarkdownPreviewer extends WebComponentBase {
    static override styles = [WebComponentBase.styles, markdownPreviewerStyles];

    @property()
    markdown = '# Hello Markdown!\n\n## Features\n\n- **Bold** and *italic* text\n- [Links](https://example.com)\n- `Code blocks`\n\n```javascript\nconst hello = "world";\n```\n\n> Blockquotes are supported too!';

    @property()
    preview = '';

    override connectedCallback() {
        super.connectedCallback();
        this.updatePreview();
    }

    private handleMarkdownChange(e: Event) {
        this.markdown = (e.target as HTMLTextAreaElement).value;
        this.updatePreview();
    }

    private updatePreview() {
        this.preview = markdownToHtml(this.markdown);
    }

    override render() {
        return html`
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Markdown Input</span>
                    <textarea
                        class="form-textarea w-full font-mono"
                        placeholder="Enter markdown here..."
                        rows="15"
                        .value=${this.markdown}
                        @input=${this.handleMarkdownChange}
                    ></textarea>
                </label>

                <div class="block">
                    <div class="flex items-center justify-between py-1">
                        <span class="font-bold">Preview</span>
                        <t-copy-button .text=${this.markdown} title="Copy Markdown"></t-copy-button>
                    </div>
                    <div class="preview-pane border border-gray-200 dark:border-gray-700 rounded p-4 min-h-[300px] overflow-auto">
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
