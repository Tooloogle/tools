import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonFormatterStyles from './json-formatter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('json-formatter')
export class JsonFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, jsonFormatterStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    error = '';

    @property()
    indentSize = 2;

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
        this.error = '';
    }

    private handleIndentChange(e: Event) {
        this.indentSize = parseInt((e.target as HTMLSelectElement).value);
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
                <textarea
                    class="form-textarea font-mono text-sm"
                    placeholder="Paste JSON here..."
                    rows="10"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 space-y-2">
                <label class="block">
                    <span class="inline-block font-bold">Indent Size:</span>
                    <select
                        class="form-select"
                        .value=${String(this.indentSize)}
                        @change=${this.handleIndentChange}
                    >
                        <option value="2">2 spaces</option>
                        <option value="4">4 spaces</option>
                        <option value="8">8 spaces</option>
                    </select>
                </label>

                <div class="flex flex-wrap gap-2">
                    <button class="btn btn-blue" @click=${this.formatJson}>Format</button>
                    <button class="btn btn-blue" @click=${this.minifyJson}>Minify</button>
                    <button class="btn btn-blue" @click=${this.validateJson}>Validate</button>
                    <button class="btn btn-red" @click=${this.clear}>Clear</button>
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
                    <textarea
                        class="form-textarea font-mono text-sm"
                        rows="10"
                        readonly
                        .value=${this.output}
                    ></textarea>
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
