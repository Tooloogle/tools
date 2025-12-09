import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import romanNumeralConverterStyles from './roman-numeral-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-button';
import '../t-input';

@customElement('roman-numeral-converter')
export class RomanNumeralConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, romanNumeralConverterStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    error = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
        this.error = '';
    }

    private toRoman() {
        this.error = '';
        const num = parseInt(this.input);
        
        if (isNaN(num) || num < 1 || num > 3999) {
            this.error = 'Please enter a number between 1 and 3999';
            this.output = '';
            return;
        }
        
        const romanNumerals = [
            ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
            ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
            ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
        ] as const;
        
        let result = '';
        let remaining = num;
        
        for (const [roman, value] of romanNumerals) {
            while (remaining >= value) {
                result += roman;
                remaining -= value;
            }
        }
        
        this.output = result;
    }

    private fromRoman() {
        this.error = '';
        const roman = this.input.toUpperCase();
        
        if (!/^[MDCLXVI]+$/.test(roman)) {
            this.error = 'Invalid Roman numeral. Use only M, D, C, L, X, V, I';
            this.output = '';
            return;
        }
        
        const romanValues: Record<string, number> = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50,
            'C': 100, 'D': 500, 'M': 1000
        };
        
        let result = 0;
        
        for (let i = 0; i < roman.length; i++) {
            const current = romanValues[roman[i]];
            const next = romanValues[roman[i + 1]];
            
            if (next && current < next) {
                result -= current;
            } else {
                result += current;
            }
        }
        
        this.output = result.toString();
    }

    private clear() {
        this.input = '';
        this.output = '';
        this.error = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input:</span>
                <t-input placeholder="Enter number (1-3999) or Roman numeral..."></t-input>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.toRoman}>To Roman</t-button>
                <t-button variant="blue" @click=${this.fromRoman}>From Roman</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.error ? html`
                <div class="py-2">
                    <div class="p-3 bg-red-100 text-red-800 rounded">
                        ${this.error}
                    </div>
                </div>
            ` : ''}

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <t-input ?readonly=${true}></t-input>
                    <div class="py-2 text-right">
                        <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
                    </div>
                </label>
            ` : ''}

            <div class="mt-4 p-3 bg-blue-50 rounded text-sm">
                <p class="font-bold">Roman Numeral Rules:</p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                    <li>I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000</li>
                    <li>Supported range: 1 to 3999</li>
                    <li>Subtractive notation: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900</li>
                </ul>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'roman-numeral-converter': RomanNumeralConverter;
    }
}
