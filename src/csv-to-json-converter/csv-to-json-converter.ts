import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import csvToJsonConverterStyles from './csv-to-json-converter.css.js';
import '../t-copy-button/index.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';

@customElement('csv-to-json-converter')
export class CsvToJsonConverter extends WebComponentBase {
  static override styles = [WebComponentBase.styles, csvToJsonConverterStyles];

  @property({ type: String }) csvString = '';
  @state() jsonString = '';
  @state() separator = ',';
  @state() parseNumbers = false;
  @state() parseJson = false;
  @state() outputAsArray = true;
  @state() minifyOutput = false;

  private onCsvInputChange(event: Event) {
    const inputElement = event.target as HTMLTextAreaElement;
    this.csvString = inputElement.value;
    this.convertCsvToJson();
  }

  private convertCsvToJson() {
    if (!this.csvString.trim()) {
      this.jsonString = '';
      return;
    }

    const rows = this.parseCsv(this.csvString, this.separator).filter(
      row => !(row.length === 1 && row[0] === '')
    );
    if (rows.length === 0) {
      this.jsonString = '';
      return;
    }

    const headers = rows[0].map(header => header.trim());
    const records = rows.slice(1).map(row => this.rowToObject(headers, row));
    const indent = this.minifyOutput ? 0 : 2;
    const result = this.outputAsArray
      ? records
      : this.toKeyedObject(records, headers);

    this.jsonString = JSON.stringify(result, null, indent);
  }

  private rowToObject(
    headers: string[],
    values: string[]
  ): Record<string, unknown> {
    return headers.reduce((acc, header, index) => {
      acc[header] = this.parseValue(values[index]?.trim() ?? '');
      return acc;
    }, {} as Record<string, unknown>);
  }

  private parseValue(value: string): unknown {
    if (this.parseNumbers && value !== '' && !isNaN(Number(value))) {
      return Number(value);
    }

    if (this.parseJson) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return value;
  }

  private toKeyedObject(
    records: Record<string, unknown>[],
    headers: string[]
  ): Record<string, unknown> {
    return records.reduce((acc, obj) => {
      acc[String(obj[headers[0]] ?? '')] = obj;
      return acc;
    }, {} as Record<string, unknown>);
  }

  // eslint-disable-next-line complexity
  private parseCsv(text: string, separator: string): string[][] {
    const rows: string[][] = [];
    let field = '';
    let row: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (inQuotes) {
        if (char === '"' && text[i + 1] === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === separator) {
        row.push(field);
        field = '';
      } else if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (char !== '\r') {
        field += char;
      }
    }

    if (field !== '' || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    return rows;
  }

  private handleFileUpload(event: CustomEvent<TFileDropzoneChangeDetail>) {
    const file = event.detail.file;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.csvString = e.target?.result as string;
        this.convertCsvToJson();
      };

      reader.readAsText(file);
    }
  }

  private downloadJSON() {
    const blob = new Blob([this.jsonString], { type: 'text/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'output.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private onParseNumbersChange(e: Event) {
    this.parseNumbers = (e.target as HTMLInputElement).checked;
    this.convertCsvToJson();
  }

  private onOutputAsArrayChange(e: Event) {
    this.outputAsArray = (e.target as HTMLInputElement).checked;
    this.convertCsvToJson();
  }

  private onMinifyOutputChange(e: Event) {
    this.minifyOutput = (e.target as HTMLInputElement).checked;
    this.convertCsvToJson();
  }

  private onSeparatorChange(e: Event) {
    this.separator = (e.target as HTMLSelectElement).value;
    this.convertCsvToJson();
  }
  // eslint-disable-next-line max-lines-per-function
  override render() {
    return html`
      <div class="csv-to-json-converter text-gray-900 dark:text-gray-100">
        <div class="editor mb-4">
          <textarea
            class="form-textarea"
            .value="${this.csvString}"
            @input="${this.onCsvInputChange}"
            placeholder="Paste CSV data here or upload a file"
            rows="10"
          ></textarea>
          <t-file-dropzone
            accept=".csv,text/csv"
            label="Drop a CSV file here or click to browse"
            @change=${this.handleFileUpload}
          ></t-file-dropzone>
        </div>

        <div class="config mb-4">
          <label for="separator">Separator:</label>
          <select class="form-select" id="separator" @change=${this.onSeparatorChange}>
            <option value=",">Comma</option>
            <option value=";">Semicolon</option>
            <option value="\t">Tab</option>
          </select>

          <label>
            <input type="checkbox" @change=${this.onParseNumbersChange} />
            Parse Numbers
          </label>
          
          <label>
            <input type="checkbox" @change=${this.onOutputAsArrayChange} checked />
            Output as Array
          </label>

          <label>
            <input type="checkbox" @change=${this.onMinifyOutputChange} />
            Minify Output
          </label>
          
        </div>

        <div class="editor mb-4 relative">
          <textarea
            class="form-textarea"
            .value="${this.jsonString}"
            readonly
            placeholder="Converted JSON will appear here"
            rows="10"
          ></textarea>
          <button class="btn btn-blue mt-2 self-end" @click="${this.downloadJSON}">Download JSON</button>
          <div class="absolute top-2 end-3">
            <t-copy-button class="text-blue" .text=${this.jsonString}></t-copy-button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'csv-to-json-converter': CsvToJsonConverter;
  }
}
