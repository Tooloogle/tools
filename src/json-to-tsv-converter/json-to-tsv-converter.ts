import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonToTsvConverterStyles from './json-to-tsv-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('json-to-tsv-converter')
export class JsonToTsvConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, jsonToTsvConverterStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
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

            // Get all unique keys from all objects
            const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
            
            // Create header row
            const header = keys.join('\t');
            
            // Create data rows
            const rows = data.map(obj => {
                return keys.map(key => {
                    const value = obj[key];
                    return value !== undefined && value !== null ? String(value) : '';
                }).join('\t');
            });
            
            this.outputText = [header, ...rows].join('\n');
        } catch (error) {
            this.outputText = `Error: ${(error as Error).message}`;
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Input:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter input..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Output:</label>
                    <textarea
                        class="form-input w-full h-32"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                    ${this.outputText ? html`<t-copy-button .text=${this.outputText}></t-copy-button>` : ''}
                </div>
                <div class="text-sm text-gray-600">
                    Note: Convert JSON to TSV
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
