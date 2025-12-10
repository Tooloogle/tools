import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import fractionCalculatorStyles from './fraction-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input';

@customElement('fraction-calculator')
export class FractionCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, fractionCalculatorStyles];

    @property({ type: Number }) num1 = 1;
    @property({ type: Number }) den1 = 2;
    @property({ type: Number }) num2 = 1;
    @property({ type: Number }) den2 = 3;
    @property({ type: String }) operation = '+';
    @property({ type: String }) result = '';

    connectedCallback() {
        super.connectedCallback();
        this.calculate();
    }

    private gcd(a: number, b: number): number {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    private simplify(num: number, den: number): string {
        const g = this.gcd(Math.abs(num), Math.abs(den));
        const simplifiedNum = num / g;
        const simplifiedDen = den / g;
        return simplifiedDen === 1 ? `${simplifiedNum}` : `${simplifiedNum}/${simplifiedDen}`;
    }

    private calculate() {
        let resultNum = 0;
        let resultDen = 1;

        switch (this.operation) {
            case '+':
                resultNum = this.num1 * this.den2 + this.num2 * this.den1;
                resultDen = this.den1 * this.den2;
                break;
            case '-':
                resultNum = this.num1 * this.den2 - this.num2 * this.den1;
                resultDen = this.den1 * this.den2;
                break;
            case '*':
                resultNum = this.num1 * this.num2;
                resultDen = this.den1 * this.den2;
                break;
            case '/':
                resultNum = this.num1 * this.den2;
                resultDen = this.den1 * this.num2;
                break;
        }

        this.result = this.simplify(resultNum, resultDen);
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold">Fraction 1 - Numerator:</label>
                        <t-input type="number" class="w-full" .value=${String(this.num1)} @t-input=${(e: CustomEvent) => { this.num1 = Number(e.detail.value); this.calculate(); }} />
                    </div>
                    <div>
                        <label class="block mb-2 font-semibold">Denominator:</label>
                        <t-input type="number" class="w-full" .value=${String(this.den1)} @t-input=${(e: CustomEvent) => { this.den1 = Number(e.detail.value); this.calculate(); }} />
                    </div>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Operation:</label>
                    <select class="form-input w-full" .value=${this.operation}
                        @change=${(e: CustomEvent) => { this.operation = e.detail.value; this.calculate(); }}>
                        <option value="+">Add (+)</option>
                        <option value="-">Subtract (-)</option>
                        <option value="*">Multiply (×)</option>
                        <option value="/">Divide (÷)</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold">Fraction 2 - Numerator:</label>
                        <t-input type="number" class="w-full" .value=${String(this.num2)} @t-input=${(e: CustomEvent) => { this.num2 = Number(e.detail.value); this.calculate(); }} />
                    </div>
                    <div>
                        <label class="block mb-2 font-semibold">Denominator:</label>
                        <t-input type="number" class="w-full" .value=${String(this.den2)} @t-input=${(e: CustomEvent) => { this.den2 = Number(e.detail.value); this.calculate(); }} />
                    </div>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                    <div class="text-sm text-gray-600 mb-2">${this.num1}/${this.den1} ${this.operation} ${this.num2}/${this.den2} =</div>
                    <div class="text-3xl font-bold text-blue-600">${this.result}</div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'fraction-calculator': FractionCalculator;
    }
}
