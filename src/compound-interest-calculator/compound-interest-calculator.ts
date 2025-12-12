import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import compoundInterestCalculatorStyles from './compound-interest-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input';

@customElement('compound-interest-calculator')
export class CompoundInterestCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, compoundInterestCalculatorStyles];

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

    // eslint-disable-next-line max-lines-per-function
    private renderInputFields() {
        return html`
            <div>
                <label class="block mb-2 font-semibold">Principal Amount ($):</label>
                <t-input type="number" class="w-full" .value=${String(this.principal)} @t-input=${(e: CustomEvent) => { 
                        this.principal = Number(e.detail.value); 
                        this.calculate(); 
                    }}></t-input>
            </div>
            <div>
                <label class="block mb-2 font-semibold">Annual Interest Rate (%):</label>
                <t-input type="number" class="w-full" .value=${String(this.rate)} @t-input=${(e: CustomEvent) => { 
                        this.rate = Number(e.detail.value); 
                        this.calculate(); 
                    }}></t-input>
            </div>
            <div>
                <label class="block mb-2 font-semibold">Time Period (years):</label>
                <t-input type="number" class="w-full" .value=${String(this.time)} @t-input=${(e: CustomEvent) => { 
                        this.time = Number(e.detail.value); 
                        this.calculate(); 
                    }}></t-input>
            </div>
            <div>
                <label class="block mb-2 font-semibold">Compounding Frequency (per year):</label>
                <select
                    class="form-input w-full"
                    .value=${String(this.frequency)}
                    @change=${(e: CustomEvent) => { 
                        this.frequency = Number(e.detail.value); 
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
        `;
    }

    private renderResults() {
        return html`
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
        `;
    }

    override render() {
        return html`
            <div class="space-y-4">
                ${this.renderInputFields()}
                ${this.renderResults()}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'compound-interest-calculator': CompoundInterestCalculator;
    }
}
