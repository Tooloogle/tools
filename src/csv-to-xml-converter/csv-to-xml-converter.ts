import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import csvToXmlConverterStyles from './csv-to-xml-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import Papa from 'papaparse';
import { escapeXml, sanitizeXmlName } from '../_utils/XmlHelper.js';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';

@customElement('csv-to-xml-converter')
export class CsvToXmlConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    csvToXmlConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private handleFileUpload(e: CustomEvent<TFileDropzoneChangeDetail>) {
    const file = e.detail.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.inputText = event.target?.result as string;
        this.process();
      };

      reader.readAsText(file);
    }
  }

  private downloadXml() {
    const blob = new Blob([this.outputText], {
      type: 'application/xml;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'output.xml');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const result = Papa.parse<Record<string, unknown>>(this.inputText, {
        header: true,
        skipEmptyLines: true,
      });

      const data = result.data;
      const fatalError = result.errors.find(
        (e) => e.code !== 'UndetectableDelimiter'
      );
      if (fatalError) {
        this.outputText = `Error: ${fatalError.message}`;
        return;
      }

      if (!data || data.length === 0) {
        this.outputText = '';
        return;
      }

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';

      data.forEach((row) => {
        xml += '  <row>\n';
        for (const key in row) {
          if (
            key === '__parsed_extra' ||
            !Object.prototype.hasOwnProperty.call(row, key)
          ) {
            continue;
          }

          const safeKey = sanitizeXmlName(key);
          xml += `    <${safeKey}>${escapeXml(row[key])}</${safeKey}>\n`;
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
    const hasOutput =
      Boolean(this.outputText) && !this.outputText.startsWith('Error:');

    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div>
          <label class="block mb-2 font-semibold">CSV Input:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            placeholder="name,age&#10;John,30&#10;Jane,25"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
          <t-file-dropzone
            class="block mt-2"
            accept=".csv,text/csv"
            label="Drop a CSV file here or click to browse"
            @change=${this.handleFileUpload}
          ></t-file-dropzone>
        </div>
        <div>
          <label class="block mb-2 font-semibold">XML Output:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              class="btn btn-blue btn-sm"
              ?disabled=${!hasOutput}
              @click=${this.downloadXml}
            >
              Download XML
            </button>
            <t-copy-button .isIcon=${false} .disabled=${!hasOutput} .text=${this.outputText}></t-copy-button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'csv-to-xml-converter': CsvToXmlConverter;
  }
}
