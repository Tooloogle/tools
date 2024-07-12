import { html, customElement, property, state } from 'lit-element';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import jsonToCsvConverterStyles from './json-to-csv-converter.css.js';
import "../t-copy-button/t-copy-button.js";

@customElement('json-to-csv-converter')
export class JsonToCsvConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, jsonToCsvConverterStyles];

    @property({ type: String }) jsonString = '';
    @state() csvString = '';
    @state() separator = ',';
    @state() includeHeader = true;

    private onJsonInputChange(event: Event) {
        const inputElement = event.target as HTMLTextAreaElement;
        this.jsonString = inputElement.value;
    }

    private onJsonFileUpload(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        const file = inputElement.files ? inputElement.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.jsonString = e.target?.result as string;
            };
            reader.readAsText(file);
        }
    }

    private downloadCSV() {
        const blob = new Blob([this.csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'output.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    private convertJsonToCsv() {
        try {
            const jsonArray = JSON.parse(this.jsonString);
            const headers = this.includeHeader ? Object.keys(jsonArray[0]) : [];
            const csvRows = [];

            if (this.includeHeader) {
                csvRows.push(headers.join(this.separator));
            }

            jsonArray.forEach((row: Record<string, any>) => {
                const values = headers.map(header => {
                    const value = row[header] !== undefined ? row[header] : '';
                    return `"${String(value).replace(/"/g, '""')}"`;
                });
                csvRows.push(values.join(this.separator));
            });

            this.csvString = csvRows.join('\n');
        } catch (error) {
            this.csvString = 'Error parsing JSON';
        }
    }

    render() {
        return html`
            <div class="json-to-csv-converter">
                <div class="editor mb-4">
                <textarea
                    class="form-textarea"
                    .value="${this.jsonString}"
                    @input="${this.onJsonInputChange}"
                    placeholder="Paste JSON data here or upload a JSON file"
                    rows="10"
                ></textarea>
                <input class="file-input" type="file" @change="${this.onJsonFileUpload}" accept=".json" />
                <button class="btn btn-blue mt-2" @click="${this.convertJsonToCsv}">Convert to CSV</button>
                </div>

                <div class="config mb-4">
                <label for="separator">Separator:</label>
                <select id="separator" class="form-select" @change="${(e: Event) => this.separator = (e.target as HTMLSelectElement).value}">
                    <option value=",">Comma</option>
                    <option value=";">Semicolon</option>
                    <option value="\t">Tab</option>
                </select>

                <label>
                    <input type="checkbox" @change="${(e: Event) => this.includeHeader = e.target.checked}" checked />
                    Include Header
                </label>
                </div>

                <div class="editor mb-4 relative">
                    <textarea
                        class="form-textarea"
                        .value="${this.csvString}"
                        readonly
                        placeholder="Converted CSV will appear here"
                        rows="10"
                    ></textarea>
                    <button class="btn btn-blue mt-2" @click="${this.downloadCSV}">Download CSV</button>
                    <t-copy-button class="absolute top-3 end-2 text-blue" .text=${this.csvString}></t-copy-button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-to-csv-converter': JsonToCsvConverter;
    }
}
