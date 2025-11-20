import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import sqlToJsonConverterStyles from './sql-to-json-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('sql-to-json-converter')
export class SqlToJsonConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, sqlToJsonConverterStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';
    @property({ type: String }) errorMessage = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        this.errorMessage = '';
        
        if (!this.inputText.trim()) {
            this.outputText = '';
            return;
        }

        try {
            // Parse SQL table format (simple table-like text format)
            const lines = this.inputText.trim().split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
                this.errorMessage = 'Need at least a header row and one data row';
                this.outputText = '';
                return;
            }

            // First line is headers
            const headerLine = lines[0].trim();
            const headers = headerLine.split(/[\t|,]/).map(h => h.trim()).filter(h => h);

            if (headers.length === 0) {
                this.errorMessage = 'No headers found. Use tab, pipe (|), or comma separated format.';
                this.outputText = '';
                return;
            }

            // Rest are data rows
            const result: any[] = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // Try to determine separator (tab, pipe, or comma)
                const values = line.split(/[\t|,]/).map(v => v.trim());
                
                if (values.length !== headers.length) {
                    // Skip rows that don't match header count
                    continue;
                }

                const obj: any = {};
                headers.forEach((header, index) => {
                    let value: any = values[index];
                    
                    // Try to parse as number
                    if (/^-?\d+(\.\d+)?$/.test(value)) {
                        value = parseFloat(value);
                    }
                    // Check for boolean
                    else if (value.toLowerCase() === 'true') {
                        value = true;
                    }
                    else if (value.toLowerCase() === 'false') {
                        value = false;
                    }
                    // Check for null
                    else if (value.toLowerCase() === 'null') {
                        value = null;
                    }

                    obj[header] = value;
                });

                result.push(obj);
            }

            if (result.length === 0) {
                this.errorMessage = 'No valid data rows found';
                this.outputText = '';
                return;
            }

            this.outputText = JSON.stringify(result, null, 2);

        } catch (error) {
            this.errorMessage = `Error: ${error instanceof Error ? error.message : 'Failed to parse SQL'}`;
            this.outputText = '';
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">SQL Table Format (Tab/Pipe/Comma Separated):</label>
                    <textarea
                        class="form-input w-full h-40"
                        placeholder="id | name | age&#10;1 | John | 30&#10;2 | Jane | 25"
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>

                ${this.errorMessage ? html`
                    <div class="p-3 bg-red-100 text-red-700 rounded">
                        ${this.errorMessage}
                    </div>
                ` : ''}

                <div>
                    <label class="block mb-2 font-semibold">JSON Output:</label>
                    <textarea
                        class="form-input w-full h-40"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                    ${this.outputText ? html`<t-copy-button .text=${this.outputText}></t-copy-button>` : ''}
                </div>

                <div class="text-sm text-gray-600">
                    Converts SQL table results (tab, pipe, or comma separated) to JSON array. First row should be headers, followed by data rows.
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'sql-to-json-converter': SqlToJsonConverter;
    }
}
