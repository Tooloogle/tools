import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssUnitConverterStyles from './css-unit-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';
@customElement('css-unit-converter')
export class CssUnitConverter extends WebComponentBase {
    static override styles = [WebComponentBase.styles, cssUnitConverterStyles];

    @property({ type: Number }) inputValue = 16;
    @property({ type: String }) fromUnit = 'px';
    @property({ type: String }) toUnit = 'rem';
    @property({ type: Number }) baseFontSize = 16;
    @property({ type: String }) result = '';

    override connectedCallback() {
        super.connectedCallback();
        this.convert();
    }

    private convert() {
        // Fall back to 16 when the base font input is cleared to avoid divide-by-zero.
        const base = this.baseFontSize || 16;
        let pxValue = this.inputValue;

        // Convert to px first
        if (this.fromUnit === 'rem' || this.fromUnit === 'em') {
            pxValue = this.inputValue * base;
        } else if (this.fromUnit === 'pt') {
            pxValue = this.inputValue * (96 / 72);
        } else if (this.fromUnit === '%') {
            pxValue = this.inputValue * base / 100;
        }

        // Convert from px to target unit
        let resultValue = pxValue;
        if (this.toUnit === 'rem' || this.toUnit === 'em') {
            resultValue = pxValue / base;
        } else if (this.toUnit === 'pt') {
            resultValue = pxValue * (72 / 96);
        } else if (this.toUnit === '%') {
            resultValue = (pxValue / base) * 100;
        }

        this.result = `${parseFloat(resultValue.toFixed(4))}${this.toUnit}`;
    }

    override render() {
        const units = ['px', 'rem', 'em', 'pt', '%'];
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Base Font Size (px):</label>
                    <input type="number" min="1" class="form-input w-full" .value=${String(this.baseFontSize)}
                        @input=${(e: Event) => { this.baseFontSize = Number((e.target as HTMLInputElement).value); this.convert(); }} />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold">Value:</label>
                        <input type="number" step="0.1" class="form-input w-full" .value=${String(this.inputValue)}
                            @input=${(e: Event) => { this.inputValue = Number((e.target as HTMLInputElement).value); this.convert(); }} />
                    </div>
                    <div>
                        <label class="block mb-2 font-semibold">From Unit:</label>
                        <select class="form-input w-full"
                            @change=${(e: Event) => { this.fromUnit = (e.target as HTMLSelectElement).value; this.convert(); }}>
                            ${units.map(u => html`<option value="${u}" ?selected=${u === this.fromUnit}>${u}</option>`)}
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">To Unit:</label>
                    <select class="form-input w-full"
                        @change=${(e: Event) => { this.toUnit = (e.target as HTMLSelectElement).value; this.convert(); }}>
                        ${units.map(u => html`<option value="${u}" ?selected=${u === this.toUnit}>${u}</option>`)}
                    </select>
                </div>
                <div class="relative bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div class="absolute top-2 end-2">
                        <t-copy-button .text=${this.result}></t-copy-button>
                    </div>
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${this.result}</div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-unit-converter': CssUnitConverter;
    }
}