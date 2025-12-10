import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonFormatterStyles from './json-formatter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-button';
import '../t-select';
import '../t-textarea';

@customElement('json-formatter')
export class JsonFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jsonFormatterStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    error = '';

    @property()
    indentSize = 2;

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
        this.error = '';
    }

    private handleIndentChange(e: CustomEvent) {
        this.indentSize = parseInt(e.detail.value);
    }

    private formatJson() {
        this.error = '';
        try {
            const parsed = JSON.parse(this.input);
            this.output = JSON.stringify(parsed, null, this.indentSize);
        } catch (e) {
            this.error = `Invalid JSON: ${  (e as Error).message}`;
            this.output = '';
        }
    }

    private minifyJson() {
        this.error = '';
        try {
            const parsed = JSON.parse(this.input);
            this.output = JSON.stringify(parsed);
        } catch (e) {
            this.error = `Invalid JSON: ${  (e as Error).message}`;
            this.output = '';
        }
    }

    private validateJson() {
        this.error = '';
        try {
            JSON.parse(this.input);
            this.error = '';
            this.output = '✓ Valid JSON';
        } catch (e) {
            this.error = `Invalid JSON: ${  (e as Error).message}`;
            this.output = '';
        }
    }

    private clear() {
        this.input = '';
        this.output = '';
        this.error = '';
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input JSON:</span>
                <t-textarea placeholder="Paste JSON here..." rows="10" class="font-mono text-sm" .value=${this.input} @t-input=${this.handleInputChange}></t-textarea>
            </label>

            <div class="py-2 space-y-2">
                <label class="block">
                    <span class="inline-block font-bold">Indent Size:</span>
                    <t-select .value=${String(this.indentSize)} @t-change=${this.handleIndentChange}>
                        <option value="2">2 spaces</option>
                        <option value="4">4 spaces</option>
                        <option value="8">8 spaces</option>
                    </t-select>
                </label>

                <div class="flex flex-wrap gap-2">
                    <t-button variant="blue" @click=${this.formatJson}>Format</t-button>
                    <t-button variant="blue" @click=${this.minifyJson}>Minify</t-button>
                    <t-button variant="blue" @click=${this.validateJson}>Validate</t-button>
                    <t-button variant="red" @click=${this.clear}>Clear</t-button>
                </div>
            </div>

            ${this.error ? html`
                <div class="py-2">
                    <div class="px-3 py-2 bg-red-100 text-red-800 rounded">
                        ${this.error}
                    </div>
                </div>
            ` : ''}

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <t-textarea rows="10" ?readonly=${true} class="font-mono text-sm" .value=${this.output}></t-textarea>
                    ${this.output !== '✓ Valid JSON' ? html`
                        <div class="py-2 text-right">
                            <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
                        </div>
                    ` : html`
                        <div class="py-2">
                            <div class="px-3 py-2 bg-green-100 text-green-800 rounded">
                                ${this.output}
                            </div>
                        </div>
                    `}
                </label>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-formatter': JsonFormatter;
    }
}
