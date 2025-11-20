import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import factorialCalculatorStyles from './factorial-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('factorial-calculator')
export class FactorialCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, factorialCalculatorStyles];

    @property({ type: Number }) inputNumber = 5;
    @property({ type: String }) result = '';
    @property({ type: String }) error = '';

    connectedCallback() {
        super.connectedCallback();
        this.calculate();
    }

    private calculate() {
        this.error = '';
        
        if (this.inputNumber < 0) {
            this.error = 'Factorial is not defined for negative numbers';
            this.result = '';
            return;
        }
        
        if (this.inputNumber > 170) {
            this.error = 'Number too large (max 170)';
            this.result = '';
            return;
        }
        
        let factorial = 1;
        for (let i = 2; i <= this.inputNumber; i++) {
            factorial *= i;
        }
        
        this.result = factorial.toExponential(10);
        if (this.inputNumber <= 20) {
            this.result = factorial.toString();
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Enter Number:</label>
                    <input
                        type="number"
                        min="0"
                        max="170"
                        class="form-input w-full"
                        .value=${String(this.inputNumber)}
                        @input=${(e: Event) => { 
                            this.inputNumber = Number((e.target as HTMLInputElement).value); 
                            this.calculate(); 
                        }}
                    />
                    <p class="text-sm text-gray-600 mt-1">Enter a number between 0 and 170</p>
                </div>
                ${this.error ? html`<div class="text-red-600 text-sm">${this.error}</div>` : ''}
                ${this.result ? html`
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="text-sm text-gray-600 mb-1">${this.inputNumber}! =</div>
                        <div class="text-2xl font-bold text-blue-600 break-all">${this.result}</div>
                        <t-copy-button .text=${this.result}></t-copy-button>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'factorial-calculator': FactorialCalculator;
    }
}
