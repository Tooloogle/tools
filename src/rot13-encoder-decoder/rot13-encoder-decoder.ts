import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import rot13EncoderDecoderStyles from './rot13-encoder-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('rot13-encoder-decoder')
export class Rot13EncoderDecoder extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    rot13EncoderDecoderStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
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
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <t-textarea placeholder="Enter text to encode/decode with ROT13..." class="w-full h-32" .value="${this.inputText}" @t-input=${this.handleInput}></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">ROT13 Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32" .value="${this.outputText}"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <p class="text-sm text-gray-600">
          Note: ROT13 is a simple letter substitution cipher. Applying it twice
          returns the original text.
        </p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rot13-encoder-decoder': Rot13EncoderDecoder;
  }
}
