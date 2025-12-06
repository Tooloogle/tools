import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import markdownToHtmlConverterStyles from './markdown-to-html-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import { marked } from 'marked';
import '../t-copy-button';
@customElement('markdown-to-html-converter')
export class MarkdownToHtmlConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    markdownToHtmlConverterStyles,
  ];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) errorMessage = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    this.errorMessage = '';

    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      // Convert Markdown to HTML using marked library
      this.outputText = marked(this.inputText) as string;
    } catch (error) {
      this.errorMessage = `Error: ${
        error instanceof Error ? error.message : 'Failed to convert Markdown'
      }`;
      this.outputText = '';
    }
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

        ${this.errorMessage
          ? html`
              <div class="p-3 bg-red-100 text-red-700 rounded">
                ${this.errorMessage}
              </div>
            `
          : ''}

        <div>
          <label class="block mb-2 font-semibold">HTML Output:</label>
          <textarea
            class="form-textarea w-full h-40"
            readonly
            .value=${this.outputText}
          ></textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>

        <div class="text-sm text-gray-600">
          Converts Markdown syntax to HTML using the marked library. Supports
          headings, lists, bold, italic, links, and more.
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
