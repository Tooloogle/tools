import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import percentageCalculatorStyles from './percentage-calculator.css.js';
import { customElement, state } from 'lit/decorators.js';

@customElement('percentage-calculator')
export class PercentageCalculator extends WebComponentBase {
    static override styles = [WebComponentBase.styles, percentageCalculatorStyles];

    // Calculator 1: What is X% of Y?
    @state() private c1Percent = '';
    @state() private c1Value = '';

    // Calculator 2: X is what % of Y?
    @state() private c2X = '';
    @state() private c2Y = '';

    // Calculator 3: % change from X to Y
    @state() private c3From = '';
    @state() private c3To = '';

    private getResult1(): string {
        const pct = parseFloat(this.c1Percent);
        const val = parseFloat(this.c1Value);

        if (isNaN(pct) || isNaN(val)) {
            return '—';
        }

        return ((pct / 100) * val).toFixed(2);
    }

    private getResult2(): string {
        const x = parseFloat(this.c2X);
        const y = parseFloat(this.c2Y);

        if (isNaN(x) || isNaN(y) || y === 0) {
            return '—';
        }

        return `${((x / y) * 100).toFixed(2)}%`;
    }

    private getResult3(): { text: string; positive: boolean } | null {
        const from = parseFloat(this.c3From);
        const to = parseFloat(this.c3To);

        if (isNaN(from) || isNaN(to) || from === 0) {
            return null;
        }

        const change = ((to - from) / from) * 100;
        return {
            text: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
            positive: change >= 0,
        };
    }

    private renderCalculator1() {
        return html`
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <h3 class="font-bold mb-3">What is X% of Y?</h3>
                <div class="grid grid-cols-2 gap-2">
                    <label class="block">
                        <span class="text-sm">Percentage (%)</span>
                        <input
                            class="form-input text-end"
                            type="number"
                            step="0.01"
                            placeholder="10"
                            .value=${this.c1Percent}
                            @input=${(e: Event) => { this.c1Percent = (e.target as HTMLInputElement).value; }}
                        />
                    </label>
                    <label class="block">
                        <span class="text-sm">Of Value</span>
                        <input
                            class="form-input text-end"
                            type="number"
                            step="0.01"
                            placeholder="200"
                            .value=${this.c1Value}
                            @input=${(e: Event) => { this.c1Value = (e.target as HTMLInputElement).value; }}
                        />
                    </label>
                </div>
                <div class="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded text-center">
                    <div class="text-sm text-gray-500">Result</div>
                    <div class="text-2xl font-bold">${this.getResult1()}</div>
                </div>
            </div>
        `;
    }

    private renderCalculator2() {
        return html`
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <h3 class="font-bold mb-3">X is what % of Y?</h3>
                <div class="grid grid-cols-2 gap-2">
                    <label class="block">
                        <span class="text-sm">Value X</span>
                        <input
                            class="form-input text-end"
                            type="number"
                            step="0.01"
                            placeholder="25"
                            .value=${this.c2X}
                            @input=${(e: Event) => { this.c2X = (e.target as HTMLInputElement).value; }}
                        />
                    </label>
                    <label class="block">
                        <span class="text-sm">Of Value Y</span>
                        <input
                            class="form-input text-end"
                            type="number"
                            step="0.01"
                            placeholder="200"
                            .value=${this.c2Y}
                            @input=${(e: Event) => { this.c2Y = (e.target as HTMLInputElement).value; }}
                        />
                    </label>
                </div>
                <div class="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded text-center">
                    <div class="text-sm text-gray-500">Result</div>
                    <div class="text-2xl font-bold">${this.getResult2()}</div>
                </div>
            </div>
        `;
    }

    private renderCalculator3() {
        const result = this.getResult3();
        const bgClass = result === null
            ? 'bg-gray-100 dark:bg-gray-700'
            : result.positive
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-red-100 dark:bg-red-900/30';

        return html`
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <h3 class="font-bold mb-3">% Change from X to Y</h3>
                <div class="grid grid-cols-2 gap-2">
                    <label class="block">
                        <span class="text-sm">From Value</span>
                        <input
                            class="form-input text-end"
                            type="number"
                            step="0.01"
                            placeholder="80"
                            .value=${this.c3From}
                            @input=${(e: Event) => { this.c3From = (e.target as HTMLInputElement).value; }}
                        />
                    </label>
                    <label class="block">
                        <span class="text-sm">To Value</span>
                        <input
                            class="form-input text-end"
                            type="number"
                            step="0.01"
                            placeholder="100"
                            .value=${this.c3To}
                            @input=${(e: Event) => { this.c3To = (e.target as HTMLInputElement).value; }}
                        />
                    </label>
                </div>
                <div class="mt-3 p-3 ${bgClass} rounded text-center">
                    <div class="text-sm text-gray-500">Result</div>
                    <div class="text-2xl font-bold">
                        ${result ? result.text : '—'}
                    </div>
                    ${result
                        ? html`<div class="text-xs text-gray-500">
                              ${result.positive ? 'Increase' : 'Decrease'}
                          </div>`
                        : ''}
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

                <div class="text-xs text-gray-500">
                    <strong>Note:</strong> Each calculator operates independently.
                    Enter values and results update instantly.
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'percentage-calculator': PercentageCalculator;
    }
}
