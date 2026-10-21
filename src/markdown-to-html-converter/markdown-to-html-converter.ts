import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import markdownToHtmlConverterStyles from './markdown-to-html-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { markdownToHtml } from '../_utils/MarkdownParser.js';
import jsBeautify from 'js-beautify';
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

    this.outputText = jsBeautify.html_beautify(markdownToHtml(this.inputText), {
      indent_size: 2,
      preserve_newlines: true,
      max_preserve_newlines: 1,
      end_with_newline: false,
    });
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <label class="block">
          <span class="inline-block py-1">Markdown Input</span>
          <textarea
            class="form-textarea w-full h-40"
            placeholder="# Hello World&#10;&#10;This is **bold** and *italic* text.&#10;&#10;- List item 1&#10;- List item 2"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </label>

        <div>
          <div class="flex items-center justify-between">
            <span class="inline-block py-1">HTML Output</span>
            <t-copy-button
              .disabled=${!this.outputText}
              .text=${this.outputText}
            ></t-copy-button>
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
                <span class="inline-block py-1">Preview</span>
                <div
                  class="preview-pane border border-gray-200 dark:border-gray-700 rounded p-4 min-h-[100px] overflow-auto"
                >
                  ${unsafeHTML(this.outputText)}
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'markdown-to-html-converter': MarkdownToHtmlConverter;
  }
}
