import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import textToBinaryConverterStyles from './text-to-binary-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';

@customElement('text-to-binary-converter')
export class TextToBinaryConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    textToBinaryConverterStyles,
  ];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputBinary = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.outputBinary = this.textToBinary(this.inputText);
  }

  private textToBinary(text: string): string {
    return text
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to convert to binary..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Binary Output:</label>
          <textarea
            class="form-textarea w-full h-32 font-mono"
            readonly
            .value=${this.outputBinary}
          ></textarea>
          ${this.outputBinary
            ? html`<t-copy-button .text=${this.outputBinary}></t-copy-button>`
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-to-binary-converter': TextToBinaryConverter;
  }
}
