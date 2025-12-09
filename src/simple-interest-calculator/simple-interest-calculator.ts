import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import simpleInterestCalculatorStyles from './simple-interest-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('simple-interest-calculator')
export class SimpleInterestCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, simpleInterestCalculatorStyles];

    @property({ type: Number }) principal = 1000;
    @property({ type: Number }) rate = 5;
    @property({ type: Number }) time = 1;
    @property({ type: Number }) interest = 0;
    @property({ type: Number }) totalAmount = 0;

    connectedCallback() {
        super.connectedCallback();
        this.calculate();
    }

    private calculate() {
        // Simple Interest Formula: SI = (P × R × T) / 100
        this.interest = (this.principal * this.rate * this.time) / 100;
        this.totalAmount = this.principal + this.interest;
    }

    override render() {
        return html`
            <div class="space-y-4">
                ${this.renderInputs()}
                ${this.renderResults()}
            </div>
        `;
    }

    private renderInputs() {
        return html`
            <div>
                <label class="block mb-2 font-semibold">Principal Amount ($):</label>
                <t-input type="number" class="w-full"></t-input> { 
                        this.principal = Number(e.detail.value); 
                        this.calculate(); 
                    }}
                />
            </div>
            <div>
                <label class="block mb-2 font-semibold">Rate of Interest (% per annum):</label>
                <t-input type="number" class="w-full"></t-input> { 
                        this.rate = Number(e.detail.value); 
                        this.calculate(); 
                    }}
                />
            </div>
            <div>
                <label class="block mb-2 font-semibold">Time Period (years):</label>
                <t-input type="number" class="w-full"></t-input> { 
                        this.time = Number(e.detail.value); 
                        this.calculate(); 
                    }}
                />
            </div>
        `;
    }

    private renderResults() {
        return html`
            <div class="bg-blue-50 p-4 rounded-lg space-y-2">
                <div class="flex justify-between">
                    <span class="font-semibold">Simple Interest:</span>
                    <span class="text-lg font-semibold text-green-600">$${this.interest.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-semibold">Total Amount:</span>
                    <span class="text-xl font-bold text-blue-600">$${this.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'simple-interest-calculator': SimpleInterestCalculator;
    }
}
