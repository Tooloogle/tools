import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import goldPurityCalculatorStyles from './gold-purity-calculator.css.js';
import '../t-input';

@customElement('gold-purity-calculator')
export class GoldPurityCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, goldPurityCalculatorStyles];

    @property()
    karat = 24

    @property()
    purity = 100;

    @property()
    weight = 0;

    @property()
    pricePerGram = 0;

    @property()
    totalPrice = 0;

    onKaratChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (!target?.value) {
            return;
        }

        this.karat = Number(target?.value);
        if (this.karat < 1 || this.karat > 24) {
            this.karat = 24;
            this.purity = 100;
        }

        this.purity = Number((this.karat / 24 * 100).toFixed(5));
        this.calculateTotalPrice();
    }

    onPurityChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (!target?.value) {
            return;
        }

        this.purity = Number(target?.value);
        if (this.purity < 1 || this.purity > 100) {
            this.karat = 24;
            this.purity = 100;
        }

        this.karat = Number((this.purity * 24 / 100).toFixed(5));
        this.calculateTotalPrice();
    }

    onWeightChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.weight = target.value ? Number(target.value) : 0;
        this.calculateTotalPrice();
    }

    onPricePerGramChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.pricePerGram = target.value ? Number(target.value) : 0;
        this.calculateTotalPrice();
    }

    calculateTotalPrice() {
        // Total price = weight * pricePerGram * (purity / 100)
        // The purity factor adjusts the price based on the gold purity
        if (this.weight > 0 && this.pricePerGram > 0) {
            this.totalPrice = Number((this.weight * this.pricePerGram * (this.purity / 100)).toFixed(2));
        } else {
            this.totalPrice = 0;
        }
    }

    renderPurityConversion() {
        return html`
            <div class="p-4 bg-blue-50 rounded">
                <h3 class="font-bold mb-3">Gold Purity Conversion</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label>
                        <span class="text-sm block mb-1">Karat</span>
                        <t-input type="number" placeholder="Karat" .value="${String(this.karat)}" @t-input=${this.onKaratChange}></t-input>
                    </label>
                    <label>
                        <span class="text-sm block mb-1">Gold Purity (%)</span>
                        <t-input type="number" placeholder="Purity" .value="${String(this.purity)}" @t-input=${this.onPurityChange}></t-input>
                    </label>
                </div>
            </div>
        `;
    }

    renderPriceCalculator() {
        return html`
            <div class="p-4 bg-green-50 rounded">
                <h3 class="font-bold mb-3">Price Calculator</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label>
                        <span class="text-sm block mb-1">Weight (grams)</span>
                        <t-input type="number" placeholder="Enter weight" .value="${String(this.weight)}" @t-input=${this.onWeightChange}></t-input>
                    </label>
                    <label>
                        <span class="text-sm block mb-1">Price per Gram (24k)</span>
                        <t-input type="number" placeholder="Enter price per gram" .value="${String(this.pricePerGram)}" @t-input=${this.onPricePerGramChange}></t-input>
                    </label>
                </div>
                
                ${this.renderTotalPrice()}
            </div>
        `;
    }

    renderTotalPrice() {
        if (this.totalPrice <= 0) {
            return '';
        }
        
        return html`
            <div class="mt-4 p-3 bg-white rounded border-2 border-green-500">
                <div class="text-sm text-gray-600">Total Price:</div>
                <div class="text-3xl font-bold text-green-600">
                    ${this.totalPrice.toFixed(2)}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                    Based on ${this.weight}g at ${this.purity.toFixed(2)}% purity
                </div>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="grid grid-cols-1 gap-4">
                ${this.renderPurityConversion()}
                ${this.renderPriceCalculator()}
                <div class="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                    <strong>Note:</strong> Enter the current gold price per gram for accurate calculations. 
                    Gold prices fluctuate constantly.
                </div>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'gold-purity-calculator': GoldPurityCalculator;
    }
}
