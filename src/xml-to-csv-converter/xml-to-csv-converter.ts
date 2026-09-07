import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import xmlToCsvConverterStyles from './xml-to-csv-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';

@customElement('xml-to-csv-converter')
export class XmlToCsvConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    xmlToCsvConverterStyles];

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

  private downloadCsv() {
    const blob = new Blob([this.outputText], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'output.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private xmlToJson(xml: string): Array<Record<string, unknown>> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    if (xmlDoc.querySelector('parsererror')) {
      throw new Error('Invalid XML');
    }

    const parseNode = (node: Element): unknown => {
      if (node.children.length === 0) {
        return node.textContent || '';
      }

      const obj: Record<string, unknown> = {};
      Array.from(node.children).forEach(child => {
        const key = child.tagName;
        const value =
          child.children.length === 0 ? child.textContent : parseNode(child);
        obj[key] = value;
      });

      return obj;
    };

    const rows = Array.from(xmlDoc.documentElement.children);
    return rows.map(row => parseNode(row) as Record<string, unknown>);
  }

  private process() {
    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      const data = this.xmlToJson(this.inputText);

      if (data.length === 0) {
        this.outputText = '';
        return;
      }

      // Get all unique keys from object rows only
      const keys = Array.from(
        new Set(
          data.flatMap(obj =>
            obj && typeof obj === 'object' ? Object.keys(obj) : []
          )
        )
      );

      const header = keys.map(key => this.formatCell(key)).join(',');
      const rows = data.map(obj => {
        const record = (obj && typeof obj === 'object' ? obj : {}) as Record<
          string,
          unknown
        >;
        return keys.map(key => this.formatCell(record[key])).join(',');
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
    return /[",\n\r]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
  }

  override render() {
    const hasOutput =
      Boolean(this.outputText) && !this.outputText.startsWith('Error:');

    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div>
          <label class="block mb-2 font-semibold">XML Input:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            placeholder="&lt;rows&gt;&lt;row&gt;&lt;name&gt;John&lt;/name&gt;&lt;/row&gt;&lt;/rows&gt;"
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
          <t-file-dropzone
            class="block mt-2"
            accept="application/xml,text/xml,.xml"
            label="Drop an XML file here or click to browse"
            @change=${this.handleFileUpload}
          ></t-file-dropzone>
        </div>
        <div>
          <label class="block mb-2 font-semibold">CSV Output:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="flex items-center justify-end gap-2 py-2">
            <button
              class="btn btn-blue btn-sm"
              ?disabled=${!hasOutput}
              @click=${this.downloadCsv}
            >
              Download CSV
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
    'xml-to-csv-converter': XmlToCsvConverter;
  }
}
