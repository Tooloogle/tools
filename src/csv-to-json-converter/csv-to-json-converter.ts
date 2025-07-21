import { html, customElement, property, state } from 'lit-element';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import csvToJsonConverterStyles from './csv-to-json-converter.css.js';
import "../t-copy-button/t-copy-button.js";

@customElement('csv-to-json-converter')
export class CsvToJsonConverter extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, csvToJsonConverterStyles];

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
  }

  private convertCsvToJson() {
    const rows = this.csvString.split('\n');
    const headers = rows[0].split(this.separator);
    const jsonArray = rows.slice(1).map(row => {
      const values = row.split(this.separator);
      const jsonObject = headers.reduce((acc, header, index) => {
        let value: number | string = values[index]?.trim() || '';
        if (this.parseNumbers && !isNaN(Number(value))) {
          value = Number(value);
        } else if (this.parseJson) {
          try {
            value = JSON.parse(value);
          } catch {
            // Keep as string if JSON parsing fails
          }
        }
        acc[header.trim()] = value;
        return acc;
      }, {} as Record<string, any>);
      return jsonObject;
    });

    this.jsonString = this.outputAsArray
      ? JSON.stringify(jsonArray, null, this.minifyOutput ? 0 : 2)
      : JSON.stringify(jsonArray.reduce((acc, obj) => {
        acc[obj[headers[0]] || ''] = obj;
        return acc;
      }, {}), null, this.minifyOutput ? 0 : 2);
  }

  private formatJson() {
    try {
      const formattedJson = JSON.stringify(JSON.parse(this.jsonString), null, 2);
      this.jsonString = formattedJson;
    } catch (err) {
      // Handle JSON formatting error if needed
    }
  }

  private handleFileUpload(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.csvString = e.target?.result as string;
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

  // eslint-disable-next-line max-lines-per-function
  render() {
    return html`
      <div class="csv-to-json-converter">
        <div class="editor mb-4">
          <textarea
            class="form-textarea"
            .value="${this.csvString}"
            @input="${this.onCsvInputChange}"
            placeholder="Paste CSV data here or upload a file"
            rows="10"
          ></textarea>
          <input type="file" accept=".csv" @change="${this.handleFileUpload}" class="file-input" />
          <button class="btn btn-blue mt-2" @click="${this.convertCsvToJson}">Convert to JSON</button>
        </div>

        <div class="config mb-4">
          <label for="separator">Separator:</label>
          <select class="form-select" id="separator" @change="${(e: Event) => this.separator = (e.target as HTMLSelectElement).value}">
            <option value=",">Comma</option>
            <option value=";">Semicolon</option>
            <option value="\t">Tab</option>
          </select>

          <label>
            <input type="checkbox" @change="${(e: any) => this.parseNumbers = e?.target?.checked}" />
            Parse Numbers
          </label>
          
          <label>
            <input type="checkbox" @change="${(e: any) => this.outputAsArray = e?.target?.checked}" checked />
            Output as Array
          </label>

          <label>
            <input type="checkbox" @change="${(e: any) => this.minifyOutput = e?.target?.checked}" />
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
          <button class="btn btn-blue mt-2" @click="${this.downloadJSON}">Download JSON</button>
          <div class="absolute top-2 end-2">
            <t-copy-button class="text-blue" .isIcon=${false} .text=${this.jsonString}></t-copy-button>
            <button class="btn btn-blue btn-sm" @click="${this.formatJson}">Format JSON</button>
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
