import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import tsvToJsonConverterStyles from './tsv-to-json-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';

@customElement('tsv-to-json-converter')
export class TsvToJsonConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    tsvToJsonConverterStyles];

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

  private downloadJson() {
    const blob = new Blob([this.outputText], {
      type: 'application/json;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'output.json');
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
      const lines = this.inputText
        .trim()
        .split(/\r?\n/)
        .filter(line => line.length > 0);

      if (lines.length === 0) {
        this.outputText = '[]';
        return;
      }

      // First line is headers
      const headers = lines[0].split('\t');

      // Parse remaining lines as data
      const data = lines.slice(1).map(line => {
        const values = line.split('\t');
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] ?? '';
        });
        return obj;
      });

      this.outputText = JSON.stringify(data, null, 2);
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
          <label class="block mb-2 font-semibold">TSV Input:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            placeholder="name&#9;age&#10;John&#9;30&#10;Jane&#9;25"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
          <t-file-dropzone
            class="block mt-2"
            accept=".tsv,text/tab-separated-values"
            label="Drop a TSV file here or click to browse"
            @change=${this.handleFileUpload}
          ></t-file-dropzone>
        </div>
        <div>
          <label class="block mb-2 font-semibold">JSON Output:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              class="btn btn-blue btn-sm"
              ?disabled=${!hasOutput}
              @click=${this.downloadJson}
            >
              Download JSON
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
    'tsv-to-json-converter': TsvToJsonConverter;
  }
}
