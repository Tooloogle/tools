import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import octalConverterStyles from './octal-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('octal-converter')
export class OctalConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, octalConverterStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) decimalOutput = '';
    @property({ type: String }) binaryOutput = '';
    @property({ type: String }) hexOutput = '';
    @property({ type: String }) error = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        this.error = '';
        
        if (!this.inputText) {
            this.decimalOutput = '';
            this.binaryOutput = '';
            this.hexOutput = '';
            return;
        }

        try {
            const octal = this.inputText.trim();
            if (!/^[0-7]+$/.test(octal)) {
                this.error = 'Invalid octal number (use digits 0-7 only)';
                this.decimalOutput = '';
                this.binaryOutput = '';
                this.hexOutput = '';
                return;
            }

            const decimal = parseInt(octal, 8);
            this.decimalOutput = decimal.toString(10);
            this.binaryOutput = decimal.toString(2);
            this.hexOutput = decimal.toString(16).toUpperCase();
        } catch (err) {
            this.error = 'Error converting octal number';
            this.decimalOutput = '';
            this.binaryOutput = '';
            this.hexOutput = '';
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Octal Input:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="Enter octal number (e.g., 755)..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    />
                </div>
                ${this.error ? html`<div class="text-red-600 text-sm">${this.error}</div>` : ''}
                ${this.decimalOutput ? html`
                    <div class="bg-gray-100 p-4 rounded space-y-2">
                        <div class="flex justify-between">
                            <span class="font-semibold">Decimal:</span>
                            <span class="font-mono">${this.decimalOutput}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Binary:</span>
                            <span class="font-mono">${this.binaryOutput}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-semibold">Hexadecimal:</span>
                            <span class="font-mono">${this.hexOutput}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'octal-converter': OctalConverter;
    }
}
