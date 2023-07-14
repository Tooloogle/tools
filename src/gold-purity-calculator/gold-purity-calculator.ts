import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import goldPurityCalculatorStyles from './gold-purity-calculator.css.js';

@customElement('gold-purity-calculator')
export class GoldPurityCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, goldPurityCalculatorStyles];

    @property()
    karat = 24

    @property()
    purity = 100;

    onKaratChange(e: any) {
        if (!e.target?.value) {
            return;
        }
        this.karat = e.target.value;
        if (this.karat < 1 || this.karat > 24) {
            this.karat = 24;
            this.purity = 100;
        }

        this.purity = this.karat / 24 * 100;
        this.purity = Number(this.purity.toFixed(5));
    }

    onPurityChange(e: any) {
        if (!e.target?.value) {
            return;
        }

        this.purity = e.target.value;
        if (this.purity < 1 || this.purity > 100) {
            this.karat = 24;
            this.purity = 100;
        }

        this.karat = this.purity * 24 / 100;
    }

    override render() {
        return html`
            <div class="grid grid-cols-1 gap-4">
                <lable>
                    <input 
                        placeholder="Karat"
                        class="text-end w-full sm:w-3/4 md:w-1/3 form-input rounded-lg text-sm" 
                        type="number"
                        min="1"
                        max="24"
                        .value=${this.karat}
                        @keyup=${this.onKaratChange}
                        @change=${this.onKaratChange}/>
                </lable>
                <lable>
                    <input 
                        placeholder="Purity"
                        class="text-end w-full sm:w-3/4 md:w-1/3 form-input rounded-lg text-sm" 
                        type="number"
                        min="1"
                        max="100"
                        .value=${this.purity}
                        @keyup=${this.onPurityChange}
                        @change=${this.onPurityChange}/>
                </lable>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'gold-purity-calculator': GoldPurityCalculator;
    }
}
