import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import tsvToJsonConverterStyles from './tsv-to-json-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';

@customElement('tsv-to-json-converter')
export class TsvToJsonConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    tsvToJsonConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const lines = this.inputText.trim().split('\n');

      if (lines.length === 0) {
        this.outputText = '[]';
        return;
      }

      // First line is headers
      const headers = lines[0].split('\t');

      // Parse remaining lines as data
      const data = lines.slice(1).map(line => {
        const values = line.split('\t');
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });

      this.outputText = JSON.stringify(data, null, 2);
    } catch (error) {
      this.outputText = `Error: ${(error as Error).message}`;
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input:</label>
          <t-textarea placeholder="Enter input..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <div class="text-sm text-gray-600">Note: Convert TSV to JSON</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tsv-to-json-converter': TsvToJsonConverter;
  }
}
