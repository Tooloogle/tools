import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import lcmCalculatorStyles from './lcm-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('lcm-calculator')
export class LcmCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, lcmCalculatorStyles];

    @property({ type: Number }) value1 = 0;
    @property({ type: Number }) value2 = 0;
    @property({ type: Number }) result = 0;

    private calculate() {
        // Calculation logic
        this.result = this.value1 + this.value2;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Value 1:</label>
                    <input
                        type="number"
                        class="form-input w-full"
                        .value=${String(this.value1)}
                        @input=${(e: Event) => { this.value1 = Number((e.target as HTMLInputElement).value); this.calculate(); }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Value 2:</label>
                    <input
                        type="number"
                        class="form-input w-full"
                        .value=${String(this.value2)}
                        @input=${(e: Event) => { this.value2 = Number((e.target as HTMLInputElement).value); this.calculate(); }}
                    />
                </div>
                ${this.result !== 0 ? html`
                    <div class="bg-gray-100 p-4 rounded">
                        <div class="text-lg font-bold">Result: ${this.result}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lcm-calculator': LcmCalculator;
    }
}
