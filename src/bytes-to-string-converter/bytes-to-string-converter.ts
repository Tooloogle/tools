import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import bytesToStringConverterStyles from './bytes-to-string-converter.css.js';
import '../t-textarea';

@customElement('bytes-to-string-converter')
export class BytesToStringConverter extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, bytesToStringConverterStyles];

  @property({ type: String }) byteInput = '';
  @property({ type: String }) stringOutput = '';

  handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.byteInput = target.value;

    this.convertBytesToString();
  }

  convertBytesToString() {
    try {
      const bytes = this.byteInput.split(this.byteInput.includes(",") ? "," : " ").map(byte => parseInt(byte, 10));
      this.stringOutput = new TextDecoder().decode(new Uint8Array(bytes));
    } catch (error) {
      this.stringOutput = 'Invalid byte input';
    }
  }

  render() {
    return html`
      <div class="container">
        <label for="byteInput">Bytes (space or comma separated):</label>
        <t-textarea .value="${String(this.byteInput)}" @t-input="${this.handleInputChange}"></t-textarea>
      </div>
      <div class="container">
        <label for="stringOutput">String:</label>
        <t-textarea .value="${String(this.stringOutput)}" ?readonly=${true}></t-textarea>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bytes-to-string-converter': BytesToStringConverter;
  }
}
