import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  WebComponentBase,
  IConfigBase,
} from '../_web-component/WebComponentBase.js';
import cssBeautifierStyles from './css-beautifier.css.js';
import jsBeautify from 'js-beautify';
import '../t-button';
import '../t-textarea';

declare global {
  interface Window {
    css_beautify: (
      code: string,
      options: {
        indent_size?: number;
        space_after_comma?: boolean;
        end_with_newline?: boolean;
      }
    ) => string;
  }
}
@customElement('css-beautifier')
export class CssBeautifier extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    cssBeautifierStyles];

  @property({ type: String }) codeInput = '';
  @state() indentSize = 4;
  @state() endWithNewline = true;
  @state() useSpaceAfterComma = false;

  private onInputChange(event: Event) {
    const inputElement = event.target as HTMLTextAreaElement;
    this.codeInput = inputElement.value;
  }

  private onBeautify() {
    this.codeInput = jsBeautify.css(this.codeInput, {
      indent_size: this.indentSize,
      end_with_newline: this.endWithNewline,
    });
  }

  private onIndentSizeChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.indentSize = parseInt(inputElement.value);
  }

  private onCheckboxChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const propName = inputElement.name as keyof Pick<
      CssBeautifier,
      'useSpaceAfterComma' | 'endWithNewline'
    >;
    this[propName] = inputElement.checked;
  }

  render() {
    return html`
      <div class="css-beautifier">
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
            End with newline:
            <input
              type="checkbox"
              class="ml-2 form-checkbox"
              name="endWithNewline"
              .checked="${this.endWithNewline}"
              @change="${this.onCheckboxChange}"
            />
          </label>
        </div>
        <div class="editor mb-4">
          <t-textarea placeholder="Paste your CSS code here..." .value="${String(this.codeInput)}" @t-input="${this.onInputChange}" class="w-full h-64 p-2 border border-gray-300 rounded-md"></t-textarea>
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
    'css-beautifier': CssBeautifier;
  }
}
