import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlToMarkdownConverterStyles from './html-to-markdown-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { markdownToHtml } from '../_utils/MarkdownParser.js';
import { htmlToMarkdown } from './html-to-markdown.js';
import '../t-copy-button/index.js';

@customElement('html-to-markdown-converter')
export class HtmlToMarkdownConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    htmlToMarkdownConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    this.outputText = this.inputText.trim()
      ? htmlToMarkdown(this.inputText)
      : '';
  }

  private getPreviewHtml(): string {
    if (!this.outputText) {
      return '';
    }

    return markdownToHtml(this.outputText);
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div>
          <label class="block mb-2 font-semibold">HTML Input:</label>
          <textarea
            class="form-textarea w-full h-40"
            placeholder="&lt;h1&gt;Hello World&lt;/h1&gt;&#10;&lt;p&gt;This is &lt;strong&gt;bold&lt;/strong&gt; and &lt;em&gt;italic&lt;/em&gt; text.&lt;/p&gt;"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>

        <div>
          <label class="block mb-2 font-semibold">Markdown Output:</label>
          <div class="relative">
            <textarea
              class="form-textarea w-full h-40 font-mono text-sm pr-10"
              readonly
              .value=${this.outputText}
            ></textarea>
            <t-copy-button
              class="absolute top-2 right-2"
              .disabled=${!this.outputText}
              .text=${this.outputText}
            ></t-copy-button>
          </div>
        </div>

        ${this.outputText
          ? html`
              <div>
                <label class="block mb-2 font-semibold">Preview:</label>
                <div
                  class="preview-pane border border-gray-200 dark:border-gray-700 rounded p-4 min-h-[100px] overflow-auto"
                >
                  ${unsafeHTML(this.getPreviewHtml())}
                </div>
              </div>
            `
          : ''}

        <div class="text-xs text-gray-500 dark:text-gray-400">
          <strong>Note:</strong> Converts HTML to Markdown syntax. Supports
          headings, lists, bold, italic, links, images, and code.
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'html-to-markdown-converter': HtmlToMarkdownConverter;
  }
}
