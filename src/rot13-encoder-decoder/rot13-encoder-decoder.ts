import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import rot13EncoderDecoderStyles from './rot13-encoder-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';

@customElement('rot13-encoder-decoder')
export class Rot13EncoderDecoder extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    rot13EncoderDecoderStyles,
  ];

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
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to encode/decode with ROT13..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">ROT13 Output:</label>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
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
