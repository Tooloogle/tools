import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import csvToXmlConverterStyles from './csv-to-xml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import Papa from 'papaparse';
import '../t-copy-button/t-copy-button.js';

@customElement('csv-to-xml-converter')
export class CsvToXmlConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    csvToXmlConverterStyles];

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
      const result = Papa.parse(this.inputText, {
        header: true,
        skipEmptyLines: true,
      });

      if (result.errors.length > 0) {
        this.outputText = `Error: ${result.errors[0].message}`;
        return;
      }

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';

      result.data.forEach((row: any) => {
        xml += '  <row>\n';
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            xml += `    <${key}>${row[key]}</${key}>\n`;
          }
        }

        xml += '  </row>\n';
      });

      xml += '</root>';
      this.outputText = xml;
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
        <div class="text-sm text-gray-600">Note: Convert CSV to XML</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'csv-to-xml-converter': CsvToXmlConverter;
  }
}
