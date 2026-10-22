import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import textToBinaryConverterStyles from './text-to-binary-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('text-to-binary-converter')
export class TextToBinaryConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    textToBinaryConverterStyles];

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
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <label class="block">
          <span class="inline-block py-1">Input Text</span>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to convert to binary..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </label>
        <div>
          <div class="flex items-center justify-between">
            <span class="inline-block py-1">Binary Output</span>
            <t-copy-button
              .disabled=${!this.outputBinary}
              .text=${this.outputBinary}
            ></t-copy-button>
          </div>
          <textarea
            class="form-textarea w-full h-32 font-mono text-sm"
            readonly
            .value=${this.outputBinary}
          ></textarea>
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
