import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import romanNumeralConverterStyles from './roman-numeral-converter.css.js';
import { customElement, state } from 'lit/decorators.js';
import '../t-copy-button/index.js';

const ROMAN_NUMERALS = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
] as const;

const ROMAN_VALUES: Record<string, number> = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50,
    'C': 100, 'D': 500, 'M': 1000,
};

@customElement('roman-numeral-converter')
export class RomanNumeralConverter extends WebComponentBase {
    static override styles = [WebComponentBase.styles, romanNumeralConverterStyles];

    @state() private decimal = '';
    @state() private roman = '';
    @state() private error = '';

    private onDecimalInput(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        this.decimal = value;
        this.error = '';

        if (!value.trim()) {
            this.roman = '';
            return;
        }

        const num = parseInt(value);

        if (isNaN(num) || num < 1 || num > 3999) {
            this.error = 'Enter a number between 1 and 3999';
            this.roman = '';
            return;
        }

        this.roman = this.toRoman(num);
    }

    private onRomanInput(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        this.roman = value;
        this.error = '';

        if (!value.trim()) {
            this.decimal = '';
            return;
        }

        const upper = value.toUpperCase();

        if (!/^[MDCLXVI]+$/.test(upper)) {
            this.error = 'Use only M, D, C, L, X, V, I';
            this.decimal = '';
            return;
        }

        const result = this.fromRoman(upper);
        this.decimal = result.toString();
    }

    private toRoman(num: number): string {
        let result = '';
        let remaining = num;

        for (const [roman, value] of ROMAN_NUMERALS) {
            while (remaining >= value) {
                result += roman;
                remaining -= value;
            }
        }

        return result;
    }

    private fromRoman(roman: string): number {
        let result = 0;

        for (let i = 0; i < roman.length; i++) {
            const current = ROMAN_VALUES[roman[i]];
            const next = ROMAN_VALUES[roman[i + 1]];

            if (next && current < next) {
                result -= current;
            } else {
                result += current;
            }
        }

        return result;
    }

    private clear() {
        this.decimal = '';
        this.roman = '';
        this.error = '';
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="block mb-2 font-semibold">Decimal</span>
                        <div class="flex items-center gap-2">
                            <input
                                type="number"
                                class="form-input flex-1 text-end"
                                min="1"
                                max="3999"
                                placeholder="e.g. 42"
                                .value=${this.decimal}
                                @input=${this.onDecimalInput}
                            />
                            ${this.decimal ? html`<t-copy-button .text=${this.decimal}></t-copy-button>` : ''}
                        </div>
                    </label>
                    <label class="block">
                        <span class="block mb-2 font-semibold">Roman</span>
                        <div class="flex items-center gap-2">
                            <input
                                type="text"
                                class="form-input flex-1 text-end uppercase"
                                placeholder="e.g. XLII"
                                .value=${this.roman}
                                @input=${this.onRomanInput}
                            />
                            ${this.roman ? html`<t-copy-button .text=${this.roman}></t-copy-button>` : ''}
                        </div>
                    </label>
                </div>

                ${this.error ? html`
                    <div class="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded text-sm">
                        ${this.error}
                    </div>
                ` : ''}

                <div class="flex items-center justify-between">
                    <div class="text-xs text-gray-500">
                        Type in either field. Range: 1–3999.
                    </div>
                    ${this.decimal || this.roman ? html`
                        <button class="btn btn-red btn-sm" @click=${this.clear}>Clear</button>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'roman-numeral-converter': RomanNumeralConverter;
    }
}
