import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import ipAddressConverterStyles from './ip-address-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import tableStyles from '../_styles/table.css.js';

@customElement('ip-address-converter')
export class IpAddressConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, tableStyles, ipAddressConverterStyles];

    @property()
    input = '';

    @property()
    decimal = '';

    @property()
    hex = '';

    @property()
    binary = '';

    @property()
    error = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLInputElement).value;
        this.error = '';
    }

    private convert() {
        this.error = '';
        this.decimal = '';
        this.hex = '';
        this.binary = '';

        try {
            // Check if input is dotted decimal
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(this.input)) {
                this.convertFromDotted();
            }
            // Check if input is decimal
            else if (/^\d+$/.test(this.input)) {
                this.convertFromDecimal();
            }
            else {
                throw new Error('Invalid IP address format');
            }
        } catch (e) {
            this.error = (e as Error).message;
        }
    }

    private convertFromDotted() {
        const parts = this.input.split('.').map(p => parseInt(p));
        
        // Validate octets
        if (parts.some(p => p < 0 || p > 255)) {
            throw new Error('Each octet must be between 0 and 255');
        }
        
        const decimalValue = (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
        this.decimal = (decimalValue >>> 0).toString(); // Convert to unsigned
        
        this.hex = `0x${  parts.map(p => p.toString(16).padStart(2, '0').toUpperCase()).join('')}`;
        this.binary = parts.map(p => p.toString(2).padStart(8, '0')).join('.');
    }

    private convertFromDecimal() {
        const num = parseInt(this.input);
        
        if (num < 0 || num > 4294967295) {
            throw new Error('Decimal value must be between 0 and 4294967295');
        }
        
        const octet1 = (num >>> 24) & 255;
        const octet2 = (num >>> 16) & 255;
        const octet3 = (num >>> 8) & 255;
        const octet4 = num & 255;
        
        this.input = `${octet1}.${octet2}.${octet3}.${octet4}`;
        this.decimal = num.toString();
        this.hex = `0x${  num.toString(16).toUpperCase().padStart(8, '0')}`;
        this.binary = [octet1, octet2, octet3, octet4]
            .map(o => o.toString(2).padStart(8, '0'))
            .join('.');
    }

    private clear() {
        this.input = '';
        this.decimal = '';
        this.hex = '';
        this.binary = '';
        this.error = '';
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">IP Address:</span>
                <input
                    type="text"
                    class="form-input"
                    placeholder="Enter IP (e.g., 192.168.1.1 or decimal number)..."
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                />
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.convert}>Convert</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.error ? html`
                <div class="py-2">
                    <div class="p-3 bg-red-100 text-red-800 rounded">
                        ${this.error}
                    </div>
                </div>
            ` : ''}

            ${this.decimal ? html`
                <div class="py-2">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Format</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Dotted Decimal</td>
                                <td class="font-mono">${this.input}</td>
                            </tr>
                            <tr>
                                <td>Decimal</td>
                                <td class="font-mono">${this.decimal}</td>
                            </tr>
                            <tr>
                                <td>Hexadecimal</td>
                                <td class="font-mono">${this.hex}</td>
                            </tr>
                            <tr>
                                <td>Binary</td>
                                <td class="font-mono text-sm">${this.binary}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ip-address-converter': IpAddressConverter;
    }
}
