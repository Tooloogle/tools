import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import hexToAsciiConverterStyles from './hex-to-ascii-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('hex-to-ascii-converter')
export class HexToAsciiConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    hexToAsciiConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.convert();
  }

  private convert() {
    try {
      this.outputText = this.inputText
        .split(/\s+/)
        .map(h => String.fromCharCode(parseInt(h, 16)))
        .join('');
    } catch (e) {
      this.outputText = 'Invalid hex input';
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Hexadecimal Input:</label>
          <t-textarea .value=${this.inputText} @t-input=${this.handleInput} placeholder="Enter hex values (e.g., 48 65 6C 6C 6F)..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">ASCII Text Output:</label>
          <t-textarea .value=${this.outputText} ?readonly=${true} class="w-full h-32"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hex-to-ascii-converter': HexToAsciiConverter;
  }
}
