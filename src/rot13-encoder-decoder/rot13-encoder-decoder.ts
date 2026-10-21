import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import rot13EncoderDecoderStyles from './rot13-encoder-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('rot13-encoder-decoder')
export class Rot13EncoderDecoder extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    rot13EncoderDecoderStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.outputText = this.rot13(this.inputText);
  }

  private rot13(text: string): string {
    return text.replace(/[a-zA-Z]/g, char => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(
        ((char.charCodeAt(0) - start + 13) % 26) + start
      );
    });
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <label class="block">
          <span class="inline-block py-1">Input Text</span>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to encode/decode with ROT13..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </label>
        <div>
          <div class="flex items-center justify-between">
            <span class="inline-block py-1">ROT13 Output</span>
            <t-copy-button
              .disabled=${!this.outputText}
              .text=${this.outputText}
            ></t-copy-button>
          </div>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rot13-encoder-decoder': Rot13EncoderDecoder;
  }
}
