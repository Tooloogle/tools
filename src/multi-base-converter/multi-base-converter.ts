import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import multiBaseConverterStyles from './multi-base-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('multi-base-converter')
export class MultiBaseConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, multiBaseConverterStyles];

    @property()
    inputValue = '';

    @property()
    inputBase = 10;

    @property()
    results = new Map<number, string>();

    @property()
    error = '';

    private bases = [2, 8, 10, 12, 16, 20, 24, 32, 36];

    private isValidInput(value: string, base: number): boolean {
        if (!value) {return false;}

        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, base);
        return value.toUpperCase().split('').every(char => validChars.includes(char));
    }

    private convert() {
        this.error = '';
        this.results.clear();

        if (!this.inputValue) {
            this.requestUpdate();
            return;
        }

        if (!this.isValidInput(this.inputValue, this.inputBase)) {
            this.error = `Invalid input for base ${this.inputBase}`;
            this.requestUpdate();
            return;
        }

        try {
            const decimal = parseInt(this.inputValue, this.inputBase);
            
            if (isNaN(decimal) || !isFinite(decimal)) {
                this.error = 'Invalid number';
                this.requestUpdate();
                return;
            }

            if (decimal > Number.MAX_SAFE_INTEGER) {
                this.error = 'Number too large for safe conversion';
                this.requestUpdate();
                return;
            }

            this.bases.forEach(base => {
                this.results.set(base, decimal.toString(base).toUpperCase());
            });

            this.requestUpdate();
        } catch (e) {
            this.error = 'Conversion error';
            this.requestUpdate();
        }
    }

    private handleInputChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.inputValue = target.value.trim();
        this.convert();
    }

    private handleBaseChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.inputBase = parseInt(target.value, 10);
        this.convert();
    }

    private getBaseName(base: number): string {
        const names: Record<number, string> = {
            2: 'Binary',
            8: 'Octal',
            10: 'Decimal',
            12: 'Duodecimal',
            16: 'Hexadecimal',
            20: 'Vigesimal',
            24: 'Tetravigesimal',
            32: 'Base32',
            36: 'Base36'
        };
        return names[base] || `Base ${base}`;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1">Input Value</span>
                        <input
                            type="text"
                            class="form-input"
                            .value=${this.inputValue}
                            @input=${this.handleInputChange}
                            placeholder="Enter number"
                            autofocus
                        />
                    </label>

                    <label class="block">
                        <span class="inline-block py-1">Input Base</span>
                        <select class="form-select" .value=${this.inputBase.toString()} @change=${this.handleBaseChange}>
                            ${this.bases.map(base => html`
                                <option value="${base}">${this.getBaseName(base)} (${base})</option>
                            `)}
                        </select>
                    </label>
                </div>

                ${this.error ? html`
                    <div class="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                        ${this.error}
                    </div>
                ` : ''}

                ${this.results.size > 0 ? html`
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold">Conversions</h3>
                        ${Array.from(this.results.entries()).map(([base, value]) => html`
                            <div class="p-4 bg-gray-100 rounded flex items-center justify-between">
                                <div class="flex-1">
                                    <div class="font-semibold text-gray-700">${this.getBaseName(base)} (Base ${base})</div>
                                    <div class="text-xl font-mono break-all">${value}</div>
                                </div>
                                <t-copy-button .text=${value}></t-copy-button>
                            </div>
                        `)}
                    </div>

                    <div class="p-4 bg-blue-50 rounded border border-blue-200">
                        <div class="font-semibold text-blue-900 mb-2">Base Information</div>
                        <div class="text-sm text-blue-700 space-y-1">
                            <div><strong>Binary (2):</strong> Uses digits 0-1</div>
                            <div><strong>Octal (8):</strong> Uses digits 0-7</div>
                            <div><strong>Decimal (10):</strong> Uses digits 0-9</div>
                            <div><strong>Hexadecimal (16):</strong> Uses digits 0-9 and A-F</div>
                            <div><strong>Base36 (36):</strong> Uses digits 0-9 and A-Z</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'multi-base-converter': MultiBaseConverter;
    }
}
