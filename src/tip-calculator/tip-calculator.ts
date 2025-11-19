import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tipCalculatorStyles from './tip-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('tip-calculator')
export class TipCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, tipCalculatorStyles];

    @property({ type: Number }) billAmount = 0;
    @property({ type: Number }) tipPercent = 15;
    @property({ type: Number }) numPeople = 1;
    @property({ type: Number }) tipAmount = 0;
    @property({ type: Number }) totalAmount = 0;
    @property({ type: Number }) perPersonAmount = 0;

    private calculate() {
        this.tipAmount = (this.billAmount * this.tipPercent) / 100;
        this.totalAmount = this.billAmount + this.tipAmount;
        this.perPersonAmount = this.totalAmount / (this.numPeople || 1);
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Bill Amount ($):</label>
                    <input
                        type="number"
                        class="form-input w-full"
                        min="0"
                        step="0.01"
                        .value=${String(this.billAmount)}
                        @input=${(e: Event) => { this.billAmount = Number((e.target as HTMLInputElement).value); this.calculate(); }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Tip Percentage (%):</label>
                    <input
                        type="number"
                        class="form-input w-full"
                        min="0"
                        max="100"
                        .value=${String(this.tipPercent)}
                        @input=${(e: Event) => { this.tipPercent = Number((e.target as HTMLInputElement).value); this.calculate(); }}
                    />
                    <div class="flex gap-2 mt-2">
                        <button class="px-3 py-1 bg-blue-500 text-white rounded" @click=${() => { this.tipPercent = 10; this.calculate(); }}>10%</button>
                        <button class="px-3 py-1 bg-blue-500 text-white rounded" @click=${() => { this.tipPercent = 15; this.calculate(); }}>15%</button>
                        <button class="px-3 py-1 bg-blue-500 text-white rounded" @click=${() => { this.tipPercent = 20; this.calculate(); }}>20%</button>
                        <button class="px-3 py-1 bg-blue-500 text-white rounded" @click=${() => { this.tipPercent = 25; this.calculate(); }}>25%</button>
                    </div>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Number of People:</label>
                    <input
                        type="number"
                        class="form-input w-full"
                        min="1"
                        .value=${String(this.numPeople)}
                        @input=${(e: Event) => { this.numPeople = Number((e.target as HTMLInputElement).value); this.calculate(); }}
                    />
                </div>
                ${this.billAmount > 0 ? html`
                    <div class="bg-gray-100 p-4 rounded space-y-2">
                        <div class="flex justify-between">
                            <span>Tip Amount:</span>
                            <span class="font-bold">$${this.tipAmount.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Total Amount:</span>
                            <span class="font-bold">$${this.totalAmount.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between border-t pt-2">
                            <span>Per Person:</span>
                            <span class="font-bold text-lg">$${this.perPersonAmount.toFixed(2)}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'tip-calculator': TipCalculator;
    }
}
