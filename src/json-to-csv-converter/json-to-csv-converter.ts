import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import jsonToCsvConverterStyles from './json-to-csv-converter.css.js';
import "../t-copy-button/t-copy-button.js";
import '../t-button/t-button.js';
import '../t-select/t-select.js';
import '../t-textarea/t-textarea.js';

@customElement('json-to-csv-converter')
export class JsonToCsvConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jsonToCsvConverterStyles];

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

            jsonArray.forEach((row: Record<string, unknown>) => {
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

    private onSeparatorChange(event: Event) {
        this.separator = (event.target as HTMLSelectElement).value;
    }

    private onIncludeHeaderChange(event: Event) {
        this.includeHeader = (event.target as HTMLInputElement).checked;
    }

    render() {
        return html`
            <div class="json-to-csv-converter">
                <div class="editor mb-4">
                    <t-textarea placeholder="Paste JSON data here or upload a JSON file" rows="10" .value=${String(this.jsonString)} @t-input=${this.onJsonInputChange}></t-textarea>
                    <input class="file-input" type="file" @change=${this.onJsonFileUpload} accept=".json" />
                    <t-button variant="blue">Convert to CSV</t-button>
                </div>

                <div class="config mb-4">
                    <label for="separator">Separator:</label>
                    <select id="separator" class="form-select" @change=${this.onSeparatorChange}>
                        <option value=",">Comma</option>
                        <option value=";">Semicolon</option>
                        <option value="\t">Tab</option>
                    </select>

                    <label>
                        <input type="checkbox" @change=${this.onIncludeHeaderChange} checked />
                        Include Header
                    </label>
                </div>

                <div class="editor mb-4 relative">
                    <t-textarea placeholder="Converted CSV will appear here" rows="10" .value=${String(this.csvString)} ?readonly=${true}></t-textarea>
                    <t-button variant="blue">Download CSV</t-button>
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
