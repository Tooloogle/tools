import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import percentageCalculatorStyles from './percentage-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input';

@customElement('percentage-calculator')
export class PercentageCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, percentageCalculatorStyles];

    @property()
    value1 = 0;

    @property()
    value2 = 0;

    @property()
    percentage = 0;

    @property()
    result1 = 0; // What is X% of Y?

    @property()
    result2 = 0; // X is what % of Y?

    @property()
    result3 = 0; // What is the % increase/decrease from X to Y?

    private handleValue1Change(e: CustomEvent) {
        this.value1 = Number(e.detail.value);
        this.calculate();
    }

    private handleValue2Change(e: CustomEvent) {
        this.value2 = Number(e.detail.value);
        this.calculate();
    }

    private handlePercentageChange(e: CustomEvent) {
        this.percentage = Number(e.detail.value);
        this.calculate();
    }

    private calculate() {
        // What is X% of Y?
        this.result1 = (this.percentage / 100) * this.value2;

        // X is what % of Y?
        this.result2 = this.value2 !== 0 ? (this.value1 / this.value2) * 100 : 0;

        // What is the % increase/decrease from X to Y?
        this.result3 = this.value1 !== 0 ? ((this.value2 - this.value1) / this.value1) * 100 : 0;
    }

    private renderCalculator1() {
        return html`
            <div class="p-4 bg-gray-50 rounded">
                <h3 class="font-bold mb-3">What is X% of Y?</h3>
                <div class="grid grid-cols-2 gap-2">
                    <label class="block">
                        <span class="text-sm">Percentage (%)</span>
                        <t-input type="number" class="text-end" .value=${String(this.percentage)} @t-input=${this.handlePercentageChange}></t-input>
                    </label>
                    <label class="block">
                        <span class="text-sm">Of Value</span>
                        <t-input type="number" class="text-end" .value=${String(this.value1)} @t-input=${this.handleValue1Change}></t-input>
                    </label>
                </div>
                <div class="mt-3 p-3 bg-blue-100 rounded text-center">
                    <div class="text-sm text-gray-600">Result:</div>
                    <div class="text-2xl font-bold">${this.result1.toFixed(2)}</div>
                </div>
            </div>
        `;
    }

    private renderCalculator2() {
        return html`
            <div class="p-4 bg-gray-50 rounded">
                <h3 class="font-bold mb-3">X is what % of Y?</h3>
                <div class="grid grid-cols-2 gap-2">
                    <label class="block">
                        <span class="text-sm">Value X</span>
                        <t-input type="number" class="text-end" .value=${String(this.value1)} @t-input=${this.handleValue1Change}></t-input>
                    </label>
                    <label class="block">
                        <span class="text-sm">Of Value Y</span>
                        <t-input type="number" class="text-end" .value=${String(this.value2)} @t-input=${this.handleValue2Change}></t-input>
                    </label>
                </div>
                <div class="mt-3 p-3 bg-green-100 rounded text-center">
                    <div class="text-sm text-gray-600">Result:</div>
                    <div class="text-2xl font-bold">${this.result2.toFixed(2)}%</div>
                </div>
            </div>
        `;
    }

    private renderCalculator3() {
        return html`
            <div class="p-4 bg-gray-50 rounded">
                <h3 class="font-bold mb-3">% Increase/Decrease from X to Y</h3>
                <div class="grid grid-cols-2 gap-2">
                    <label class="block">
                        <span class="text-sm">From Value X</span>
                        <t-input type="number" class="text-end"></t-input>
                    </label>
                    <label class="block">
                        <span class="text-sm">To Value Y</span>
                        <t-input type="number" class="text-end"></t-input>
                    </label>
                </div>
                <div class="mt-3 p-3 ${this.result3 >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded text-center">
                    <div class="text-sm text-gray-600">Result:</div>
                    <div class="text-2xl font-bold">
                        ${this.result3 >= 0 ? '+' : ''}${this.result3.toFixed(2)}%
                    </div>
                    <div class="text-xs text-gray-600">
                        ${this.result3 >= 0 ? 'Increase' : 'Decrease'}
                    </div>
                </div>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="space-y-6">
                ${this.renderCalculator1()}
                ${this.renderCalculator2()}
                ${this.renderCalculator3()}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'percentage-calculator': PercentageCalculator;
    }
}
