import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import markdownPreviewerStyles from './markdown-previewer.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { markdownToHtml } from '../_utils/MarkdownParser.js';

@customElement('markdown-previewer')
export class MarkdownPreviewer extends WebComponentBase {
    static override styles = [WebComponentBase.styles, markdownPreviewerStyles];

    @property()
    markdown = '# Hello Markdown!\n\n## Features\n\n- **Bold** and *italic* text\n- [Links](https://example.com)\n- `Code blocks`\n\n```javascript\nconst hello = "world";\n```\n\n> Blockquotes are supported too!';

    @state()
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
            <div class="flex flex-col gap-4 text-gray-900 dark:text-gray-100">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Markdown Input</span>
                    <textarea
                        class="form-textarea w-full font-mono"
                        placeholder="Enter markdown here..."
                        rows="10"
                        .value=${this.markdown}
                        @input=${this.handleMarkdownChange}
                    ></textarea>
                </label>

                <div class="preview-pane card relative min-h-[300px] overflow-auto">
                    ${unsafeHTML(this.preview)}
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
