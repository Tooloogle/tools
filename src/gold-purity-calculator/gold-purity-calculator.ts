import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import goldPurityCalculatorStyles from './gold-purity-calculator.css.js';
import inputStyles from '../_styles/input.css.js';

@customElement('gold-purity-calculator')
export class GoldPurityCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, goldPurityCalculatorStyles];

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

    @state()
    isLoadingPrice = false;

    async connectedCallback() {
        super.connectedCallback();
        await this.fetchGoldPrice();
    }

    async fetchGoldPrice() {
        this.isLoadingPrice = true;
        try {
            // Try to fetch from GoldAPI.io free endpoint
            // Note: This API might require CORS or have rate limits
            // Using a fallback default value if fetch fails
            const response = await fetch('https://www.goldapi.io/api/XAU/USD');
            if (response.ok) {
                const data = await response.json();
                // GoldAPI returns price per troy ounce, convert to per gram
                // 1 troy ounce = 31.1035 grams
                if (data.price) {
                    this.pricePerGram = Number((data.price / 31.1035).toFixed(2));
                    this.calculateTotalPrice();
                }
            } else {
                // Use default value if API fails
                this.setDefaultPrice();
            }
        } catch (error) {
            // Fallback to default price if API is unavailable
            this.setDefaultPrice();
        } finally {
            this.isLoadingPrice = false;
        }
    }

    setDefaultPrice() {
        // Default price per gram for 24k gold (approximate, user can update)
        // Based on typical gold prices around $65-70 per gram for 24k
        this.pricePerGram = 70;
    }

    onKaratChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (!target?.value) return;

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
        if (!target?.value) return;

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
                        <input 
                            placeholder="Karat"
                            class="form-input" 
                            type="number"
                            min="1"
                            max="24"
                            step="0.1"
                            .value=${this.karat}
                            @keyup=${this.onKaratChange}
                            @change=${this.onKaratChange} />
                    </label>
                    <label>
                        <span class="text-sm block mb-1">Gold Purity (%)</span>
                        <input 
                            placeholder="Purity"
                            class="form-input" 
                            type="number"
                            min="1"
                            max="100"
                            step="0.1"
                            .value=${this.purity}
                            @keyup=${this.onPurityChange}
                            @change=${this.onPurityChange} />
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
                        <input 
                            placeholder="Enter weight"
                            class="form-input" 
                            type="number"
                            min="0"
                            step="0.01"
                            .value=${this.weight || ''}
                            @input=${this.onWeightChange}
                            @change=${this.onWeightChange} />
                    </label>
                    <label>
                        <span class="text-sm block mb-1">Price per Gram (24k) - USD</span>
                        <input 
                            placeholder="${this.isLoadingPrice ? 'Loading...' : 'Enter price per gram'}"
                            class="form-input" 
                            type="number"
                            min="0"
                            step="0.01"
                            .value=${this.pricePerGram || ''}
                            ?disabled=${this.isLoadingPrice}
                            @input=${this.onPricePerGramChange}
                            @change=${this.onPricePerGramChange} />
                        <span class="text-xs text-gray-500 mt-1 block">
                            ${this.isLoadingPrice ? 'Fetching current gold price...' : 'Default price provided, you can update it'}
                        </span>
                    </label>
                </div>
                
                ${this.renderTotalPrice()}
            </div>
        `;
    }

    renderTotalPrice() {
        if (this.totalPrice <= 0) return '';
        
        return html`
            <div class="mt-4 p-3 bg-white rounded border-2 border-green-500">
                <div class="text-sm text-gray-600">Total Price:</div>
                <div class="text-3xl font-bold text-green-600">
                    $${this.totalPrice.toFixed(2)}
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
                    <strong>Note:</strong> The default price is provided for reference. 
                    Gold prices fluctuate constantly. Please verify current market rates for accurate calculations.
                </div>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'gold-purity-calculator': GoldPurityCalculator;
    }
}
