import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  WebComponentBase,
  IConfigBase,
} from '../_web-component/WebComponentBase.js';
import htmlBeautifierStyles from './html-beautifier.css.js';
import jsBeautify from 'js-beautify';
import '../t-button/t-button.js';

interface JsBeautifyOptions {
  indent_size?: number;
  indent_with_tabs?: boolean;
  preserve_newlines?: boolean;
  max_preserve_newlines?: number;
  wrap_line_length?: number;
  end_with_newline?: boolean;
  unformatted?: string[];
}
declare global {
  interface Window {
    html_beautify: (code: string, options?: JsBeautifyOptions) => string;
  }
}
@customElement('html-beautifier')
export class HtmlBeautifier extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    htmlBeautifierStyles];

  @property({ type: String }) codeInput = '';
  @state() indentSize = 4;
  @state() useSpaces = true;
  @state() maxPreserveNewlines = 10;
  @state() preserveNewlines = true;
  @state() wrapLineLength = 0;
  @state() endWithNewline = true;
  @state() unformatted = '';

  private onInputChange(event: Event) {
    const inputElement = event.target as HTMLTextAreaElement;
    this.codeInput = inputElement.value;
  }

  private onBeautify() {
    this.codeInput = jsBeautify.html_beautify(this.codeInput, {
      indent_size: this.indentSize,
      indent_with_tabs: !this.useSpaces,
      preserve_newlines: this.preserveNewlines,
      max_preserve_newlines: this.maxPreserveNewlines,
      wrap_line_length: this.wrapLineLength,
      end_with_newline: this.endWithNewline,
      unformatted: this.unformatted.split(',').map(tag => tag.trim()),
    });
  }

  private onIndentSizeChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.indentSize = parseInt(inputElement.value);
  }

  private onMaxPreserveNewlinesChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.maxPreserveNewlines = parseInt(inputElement.value);
  }

  private onWrapLineLengthChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.wrapLineLength = parseInt(inputElement.value);
  }

  private onCheckboxChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const propName = inputElement.name as keyof Pick<
      HtmlBeautifier,
      'useSpaces' | 'preserveNewlines' | 'endWithNewline'
    >;
    this[propName] = inputElement.checked;
  }

  private onUnformattedChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.unformatted = inputElement.value;
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    return html`
      <div class="html-beautifier">
        <div
          class="config grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
        >
          <label class="flex items-center">
            Indent size:
            <input
              type="number"
              class="ml-2 form-input"
              .value="${this.indentSize}"
              @input="${this.onIndentSizeChange}"
              min="1"
            />
          </label>
          <label class="flex items-center">
            Use spaces:
            <input
              type="checkbox"
              class="ml-2 form-checkbox"
              name="useSpaces"
              .checked="${this.useSpaces}"
              @change="${this.onCheckboxChange}"
            />
          </label>
          <label class="flex items-center">
            Preserve newlines:
            <input
              type="checkbox"
              class="ml-2 form-checkbox"
              name="preserveNewlines"
              .checked="${this.preserveNewlines}"
              @change="${this.onCheckboxChange}"
            />
          </label>
          <label class="flex items-center">
            Max preserve newlines:
            <input
              type="number"
              class="ml-2 form-input"
              .value="${this.maxPreserveNewlines}"
              @input="${this.onMaxPreserveNewlinesChange}"
              min="0"
            />
          </label>
          <label class="flex items-center">
            Wrap line length:
            <input
              type="number"
              class="ml-2 form-input"
              .value="${this.wrapLineLength}"
              @input="${this.onWrapLineLengthChange}"
              min="0"
            />
          </label>
          <label class="flex items-center">
            End with newline:
            <input
              type="checkbox"
              class="ml-2 form-checkbox"
              name="endWithNewline"
              .checked="${this.endWithNewline}"
              @change="${this.onCheckboxChange}"
            />
          </label>
          <label class="flex items-center">
            Unformatted tags (comma separated):
            <input
              type="text"
              class="ml-2 form-input"
              .value="${this.unformatted}"
              @input="${this.onUnformattedChange}"
              placeholder="e.g., wbr"
            />
          </label>
        </div>
        <div class="editor mb-4">
          <t-textarea placeholder="Paste your HTML code here..." .value="${String(this.codeInput)}" @t-input="${this.onInputChange}" class="w-full h-64 p-2 border border-gray-300 rounded-md"></t-textarea>
        </div>
        <t-button variant="green" @click="${this.onBeautify}">
          Beautify
        </t-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'html-beautifier': HtmlBeautifier;
  }
}
