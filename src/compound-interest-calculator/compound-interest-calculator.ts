import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import compoundInterestCalculatorStyles from './compound-interest-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('compound-interest-calculator')
export class CompoundInterestCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, compoundInterestCalculatorStyles];

    @property({ type: Number }) principal = 1000;
    @property({ type: Number }) rate = 5;
    @property({ type: Number }) time = 1;
    @property({ type: Number }) frequency = 12;
    @property({ type: Number }) totalAmount = 0;
    @property({ type: Number }) interest = 0;

    connectedCallback() {
        super.connectedCallback();
        this.calculate();
    }

    private calculate() {
        // Compound Interest Formula: A = P(1 + r/n)^(nt)
        const r = this.rate / 100;
        const n = this.frequency;
        const t = this.time;
        const p = this.principal;
        
        this.totalAmount = p * Math.pow(1 + r / n, n * t);
        this.interest = this.totalAmount - p;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Principal Amount ($):</label>
                    <input
                        type="number"
                        min="0"
                        step="100"
                        class="form-input w-full"
                        .value=${String(this.principal)}
                        @input=${(e: Event) => { 
                            this.principal = Number((e.target as HTMLInputElement).value); 
                            this.calculate(); 
                        }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Annual Interest Rate (%):</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        class="form-input w-full"
                        .value=${String(this.rate)}
                        @input=${(e: Event) => { 
                            this.rate = Number((e.target as HTMLInputElement).value); 
                            this.calculate(); 
                        }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Time Period (years):</label>
                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        class="form-input w-full"
                        .value=${String(this.time)}
                        @input=${(e: Event) => { 
                            this.time = Number((e.target as HTMLInputElement).value); 
                            this.calculate(); 
                        }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Compounding Frequency (per year):</label>
                    <select
                        class="form-input w-full"
                        .value=${String(this.frequency)}
                        @change=${(e: Event) => { 
                            this.frequency = Number((e.target as HTMLSelectElement).value); 
                            this.calculate(); 
                        }}
                    >
                        <option value="1">Annually</option>
                        <option value="2">Semi-Annually</option>
                        <option value="4">Quarterly</option>
                        <option value="12" selected>Monthly</option>
                        <option value="365">Daily</option>
                    </select>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div class="flex justify-between">
                        <span class="font-semibold">Total Amount:</span>
                        <span class="text-xl font-bold text-blue-600">$${this.totalAmount.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-semibold">Interest Earned:</span>
                        <span class="text-lg font-semibold text-green-600">$${this.interest.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'compound-interest-calculator': CompoundInterestCalculator;
    }
}
