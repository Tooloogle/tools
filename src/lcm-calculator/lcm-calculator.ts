import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import lcmCalculatorStyles from './lcm-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('lcm-calculator')
export class LcmCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, lcmCalculatorStyles];

    @property({ type: Number }) num1 = 12;
    @property({ type: Number }) num2 = 18;
    @property({ type: Number }) result = 0;

    connectedCallback() {
        super.connectedCallback();
        this.calculate();
    }

    private gcd(a: number, b: number): number {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }

        return a;
    }

    private lcm(a: number, b: number): number {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / this.gcd(a, b);
    }

    private calculate() {
        this.result = this.lcm(this.num1, this.num2);
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">First Number:</label>
                    <input
                        type="number"
                        class="form-input w-full"
                        .value=${String(this.num1)}
                        @input=${(e: Event) => { 
                            this.num1 = Number((e.target as HTMLInputElement).value); 
                            this.calculate(); 
                        }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Second Number:</label>
                    <input
                        type="number"
                        class="form-input w-full"
                        .value=${String(this.num2)}
                        @input=${(e: Event) => { 
                            this.num2 = Number((e.target as HTMLInputElement).value); 
                            this.calculate(); 
                        }}
                    />
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <div class="text-sm text-gray-600 mb-1">LCM of ${this.num1} and ${this.num2}:</div>
                    <div class="text-3xl font-bold text-purple-600">${this.result}</div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lcm-calculator': LcmCalculator;
    }
}
