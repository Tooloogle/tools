import { html, customElement, property } from 'lit-element';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import bytesToStringConverterStyles from './bytes-to-string-converter.css.js';

@customElement('bytes-to-string-converter')
export class BytesToStringConverter extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, bytesToStringConverterStyles];

  @property({ type: String }) byteInput = '';
  @property({ type: String }) stringOutput = '';

  handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.byteInput = target.value;

    this.convertBytesToString();
  }

  convertBytesToString() {
    try {
      const bytes = this.byteInput.split(/[,\s]/).map(byte => parseInt(byte, 10));
      this.stringOutput = new TextDecoder().decode(new Uint8Array(bytes));
    } catch (error) {
      this.stringOutput = 'Invalid byte input';
    }
  }

  render() {
    return html`
      <div class="container">
        <label for="byteInput">Bytes (space or comma separated):</label>
        <textarea id="byteInput" row="5" class="form-textarea" .value="${this.byteInput}" @input="${this.handleInputChange}"></textarea>
      </div>
      <div class="container">
        <label for="stringOutput">String:</label>
        <textarea id="stringOutput" row="5" class="form-textarea" readonly .value="${this.stringOutput}"></textarea>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bytes-to-string-converter': BytesToStringConverter;
  }
}
