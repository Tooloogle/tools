import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import binaryConverterStyles from './binary-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('binary-converter')
export class BinaryConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, binaryConverterStyles];

    @property()
    decimal = '0';

    @property()
    binary = '0';

    @property()
    octal = '0';

    @property()
    hexadecimal = '0';

    private handleDecimalChange(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        const num = parseInt(value) || 0;
        this.decimal = String(num);
        this.updateFromDecimal(num);
    }

    private handleBinaryChange(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        if (/^[01]*$/.test(value)) {
            this.binary = value || '0';
            const num = parseInt(value, 2) || 0;
            this.updateFromNumber(num);
        }
    }

    private handleOctalChange(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        if (/^[0-7]*$/.test(value)) {
            this.octal = value || '0';
            const num = parseInt(value, 8) || 0;
            this.updateFromNumber(num);
        }
    }

    private handleHexChange(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        if (/^[0-9A-Fa-f]*$/.test(value)) {
            this.hexadecimal = value.toUpperCase() || '0';
            const num = parseInt(value, 16) || 0;
            this.updateFromNumber(num);
        }
    }

    private updateFromDecimal(num: number) {
        this.binary = num.toString(2);
        this.octal = num.toString(8);
        this.hexadecimal = num.toString(16).toUpperCase();
    }

    private updateFromNumber(num: number) {
        this.decimal = String(num);
        this.binary = num.toString(2);
        this.octal = num.toString(8);
        this.hexadecimal = num.toString(16).toUpperCase();
    }

    private clear() {
        this.decimal = '0';
        this.binary = '0';
        this.octal = '0';
        this.hexadecimal = '0';
    }

    override render() {
        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Decimal (Base 10)</span>
                    <input
                        class="form-input text-end font-mono"
                        type="text"
                        .value=${this.decimal}
                        @input=${this.handleDecimalChange}
                        placeholder="Enter decimal number"
                    />
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Binary (Base 2)</span>
                    <input
                        class="form-input text-end font-mono"
                        type="text"
                        .value=${this.binary}
                        @input=${this.handleBinaryChange}
                        placeholder="Enter binary number"
                    />
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Octal (Base 8)</span>
                    <input
                        class="form-input text-end font-mono"
                        type="text"
                        .value=${this.octal}
                        @input=${this.handleOctalChange}
                        placeholder="Enter octal number"
                    />
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Hexadecimal (Base 16)</span>
                    <input
                        class="form-input text-end font-mono"
                        type="text"
                        .value=${this.hexadecimal}
                        @input=${this.handleHexChange}
                        placeholder="Enter hex number"
                    />
                </label>

                <div class="text-right">
                    <button class="btn btn-red" @click=${this.clear}>Clear</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'binary-converter': BinaryConverter;
    }
}
