import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import discountCalculatorStyles from './discount-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('discount-calculator')
export class DiscountCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, discountCalculatorStyles];

    @property({ type: Number }) originalPrice = 0;
    @property({ type: Number }) discountPercent = 0;
    @property({ type: Number }) discountAmount = 0;
    @property({ type: Number }) finalPrice = 0;
    @property({ type: Number }) savings = 0;

    private calculate() {
        this.discountAmount = (this.originalPrice * this.discountPercent) / 100;
        this.finalPrice = this.originalPrice - this.discountAmount;
        this.savings = this.discountAmount;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Original Price ($):</label>
                    <t-input type="number" class="w-full"></t-input> { this.originalPrice = Number(e.detail.value); this.calculate(); }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Discount (%):</label>
                    <t-input type="number" class="w-full"></t-input> { this.discountPercent = Number(e.detail.value); this.calculate(); }}
                    />
                </div>
                ${this.originalPrice > 0 ? html`
                    <div class="bg-gray-100 p-4 rounded space-y-2">
                        <div class="flex justify-between">
                            <span>Discount Amount:</span>
                            <span class="font-bold text-red-600">-$${this.discountAmount.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>You Save:</span>
                            <span class="font-bold text-green-600">$${this.savings.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between border-t pt-2">
                            <span>Final Price:</span>
                            <span class="font-bold text-lg text-blue-600">$${this.finalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'discount-calculator': DiscountCalculator;
    }
}
