import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import asciiToHexConverterStyles from './ascii-to-hex-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-textarea';
import '../t-copy-button';

@customElement('ascii-to-hex-converter')
export class AsciiToHexConverter extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, asciiToHexConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.convert();
  }

  private convert() {
    this.outputText = this.inputText
      .split('')
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">ASCII Text:</label>
          <t-textarea
            placeholder="Enter ASCII text to convert..."
            .value=${this.inputText}
            @t-input=${this.handleInput}
            rows="8"
          ></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Hexadecimal Output:</label>
          <t-textarea readonly .value=${this.outputText} rows="8"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button
                .text=${this.outputText}
                .isIcon=${false}
              ></t-copy-button>`
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ascii-to-hex-converter': AsciiToHexConverter;
  }
}
