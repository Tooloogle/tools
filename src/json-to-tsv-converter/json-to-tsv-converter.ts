import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonToTsvConverterStyles from './json-to-tsv-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';

@customElement('json-to-tsv-converter')
export class JsonToTsvConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    jsonToTsvConverterStyles];

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

  private downloadTsv() {
    const blob = new Blob([this.outputText], {
      type: 'text/tab-separated-values;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'output.tsv');
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
      const data = JSON.parse(this.inputText);

      if (!Array.isArray(data)) {
        this.outputText = 'Error: Input must be a JSON array';
        return;
      }

      if (data.length === 0) {
        this.outputText = '';
        return;
      }

      // Get all unique keys from object rows only
      const keys = Array.from(
        new Set(
          data.flatMap(item =>
            item && typeof item === 'object' ? Object.keys(item) : []
          )
        )
      );

      // Create header row
      const header = keys.join('\t');

      // Create data rows
      const rows = data.map(item => {
        const record = (item && typeof item === 'object' ? item : {}) as Record<
          string,
          unknown
        >;
        return keys.map(key => this.formatCell(record[key])).join('\t');
      });

      this.outputText = [header, ...rows].join('\n');
    } catch (error) {
      this.outputText = `Error: ${(error as Error).message}`;
    }
  }

  private formatCell(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }

    const raw =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    return raw.replace(/\t/g, '\\t').replace(/\r?\n/g, '\\n');
  }

  override render() {
    const hasOutput =
      Boolean(this.outputText) && !this.outputText.startsWith('Error:');

    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div>
          <label class="block mb-2 font-semibold">JSON Input (Array of Objects):</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder='[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]'
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
          <t-file-dropzone
            class="block mt-2"
            accept=".json,application/json,text/json"
            label="Drop a JSON file here or click to browse"
            @change=${this.handleFileUpload}
          ></t-file-dropzone>
        </div>
        <div>
          <label class="block mb-2 font-semibold">TSV Output:</label>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              class="btn btn-blue btn-sm"
              ?disabled=${!hasOutput}
              @click=${this.downloadTsv}
            >
              Download TSV
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
    'json-to-tsv-converter': JsonToTsvConverter;
  }
}
