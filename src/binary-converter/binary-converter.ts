import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import binaryConverterStyles from './binary-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-button';
import '../t-input';

@customElement('binary-converter')
export class BinaryConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, binaryConverterStyles];

    @property()
    decimal = '0';

    @property()
    binary = '0';

    @property()
    octal = '0';

    @property()
    hexadecimal = '0';

    private handleDecimalChange(e: CustomEvent) {
        const value = e.detail.value;
        const num = parseInt(value) || 0;
        this.decimal = String(num);
        this.updateFromDecimal(num);
    }

    private handleBinaryChange(e: CustomEvent) {
        const value = e.detail.value;
        if (/^[01]*$/.test(value)) {
            this.binary = value || '0';
            const num = parseInt(value, 2) || 0;
            this.updateFromNumber(num);
        }
    }

    private handleOctalChange(e: CustomEvent) {
        const value = e.detail.value;
        if (/^[0-7]*$/.test(value)) {
            this.octal = value || '0';
            const num = parseInt(value, 8) || 0;
            this.updateFromNumber(num);
        }
    }

    private handleHexChange(e: CustomEvent) {
        const value = e.detail.value;
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
                    <t-input placeholder="Enter decimal number" class="text-end font-mono" .value=${this.decimal} @t-input=${this.handleDecimalChange}></t-input>
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Binary (Base 2)</span>
                    <t-input placeholder="Enter binary number" class="text-end font-mono" .value=${this.binary} @t-input=${this.handleBinaryChange}></t-input>
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Octal (Base 8)</span>
                    <t-input placeholder="Enter octal number" class="text-end font-mono" .value=${this.octal} @t-input=${this.handleOctalChange}></t-input>
                </label>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Hexadecimal (Base 16)</span>
                    <t-input placeholder="Enter hex number" class="text-end font-mono" .value=${this.hexadecimal} @t-input=${this.handleHexChange}></t-input>
                </label>

                <div class="text-right">
                    <t-button variant="red" @click=${this.clear}>Clear</t-button>
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
