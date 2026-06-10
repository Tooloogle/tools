import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import markdownToHtmlConverterStyles from './markdown-to-html-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { markdownToHtml } from '../_utils/MarkdownParser.js';
import '../t-copy-button/index.js';

@customElement('markdown-to-html-converter')
export class MarkdownToHtmlConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    markdownToHtmlConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    this.outputText = markdownToHtml(this.inputText);
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Markdown Input:</label>
          <textarea
            class="form-textarea w-full h-40"
            placeholder="# Hello World&#10;&#10;This is **bold** and *italic* text.&#10;&#10;- List item 1&#10;- List item 2"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="font-semibold">HTML Output:</label>
            ${this.outputText
              ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
              : ''}
          </div>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
        </div>

        ${this.outputText
          ? html`
              <div>
                <label class="block mb-2 font-semibold">Preview:</label>
                <div
                  class="preview-pane border border-gray-200 dark:border-gray-700 rounded p-4 min-h-[100px] overflow-auto"
                >
                  ${unsafeHTML(this.outputText)}
                </div>
              </div>
            `
          : ''}

        <div class="text-xs text-gray-500">
          <strong>Note:</strong> Converts Markdown syntax to HTML. Supports
          headings, lists, bold, italic, links, code blocks, and blockquotes.
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'markdown-to-html-converter': MarkdownToHtmlConverter;
  }
}
