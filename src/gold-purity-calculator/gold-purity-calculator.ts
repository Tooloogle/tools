import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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

    onKaratChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (!target.value) return;
        
        this.karat = Number(target.value);
        if (this.karat < 1 || this.karat > 24) {
            this.karat = 24;
            this.purity = 100;
        }

        this.purity = Number((this.karat / 24 * 100).toFixed(5));
    }

    onPurityChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (!target.value) return;

        this.purity = Number(target.value);
        if (this.purity < 1 || this.purity > 100) {
            this.karat = 24;
            this.purity = 100;
        }

        this.karat = Number((this.purity * 24 / 100).toFixed(5));
    }

    override render() {
        return html`
            <div class="grid grid-cols-1 gap-4">
                <lable>
                    Karat
                    <input 
                        placeholder="Karat"
                        class="form-input" 
                        type="number"
                        min="1"
                        max="24"
                        .value=${this.karat}
                        @keyup=${this.onKaratChange}
                        @change=${this.onKaratChange} />
                </lable>
                <lable>
                    Gold Purity
                    <input 
                        placeholder="Purity"
                        class="form-input" 
                        type="number"
                        min="1"
                        max="100"
                        .value=${this.purity}
                        @keyup=${this.onPurityChange}
                        @change=${this.onPurityChange} />
                </lable>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'gold-purity-calculator': GoldPurityCalculator;
    }
}
