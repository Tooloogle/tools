import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssUnitConverterStyles from './css-unit-converter.css.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('css-unit-converter')
export class CssUnitConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, cssUnitConverterStyles];

    @property({ type: Number }) inputValue = 16;
    @property({ type: String }) fromUnit = 'px';
    @property({ type: String }) toUnit = 'rem';
    @property({ type: Number }) baseFontSize = 16;
    @property({ type: String }) result = '';

    connectedCallback() {
        super.connectedCallback();
        this.convert();
    }

    private convert() {
        let pxValue = this.inputValue;
        
        // Convert to px first
        if (this.fromUnit === 'rem' || this.fromUnit === 'em') {
            pxValue = this.inputValue * this.baseFontSize;
        } else if (this.fromUnit === 'pt') {
            pxValue = this.inputValue * (96 / 72);
        } else if (this.fromUnit === '%') {
            pxValue = this.inputValue * this.baseFontSize / 100;
        }
        
        // Convert from px to target unit
        let resultValue = pxValue;
        if (this.toUnit === 'rem' || this.toUnit === 'em') {
            resultValue = pxValue / this.baseFontSize;
        } else if (this.toUnit === 'pt') {
            resultValue = pxValue * (72 / 96);
        } else if (this.toUnit === '%') {
            resultValue = (pxValue / this.baseFontSize) * 100;
        }
        
        this.result = `${resultValue.toFixed(4)} ${this.toUnit}`;
    }

    override render() {
        const units = ['px', 'rem', 'em', 'pt', '%'];
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Base Font Size (px):</label>
                    <t-input type="number" class="w-full"></t-input> { this.baseFontSize = Number(e.detail.value); this.convert(); }} />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold">Value:</label>
                        <t-input type="number" class="w-full"></t-input> { this.inputValue = Number(e.detail.value); this.convert(); }} />
                    </div>
                    <div>
                        <label class="block mb-2 font-semibold">From Unit:</label>
                        <select class="form-input w-full" .value=${this.fromUnit}
                            @change=${(e: CustomEvent) => { this.fromUnit = e.detail.value; this.convert(); }}>
                            ${units.map(u => html`<option value="${u}">${u}</option>`)}
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">To Unit:</label>
                    <select class="form-input w-full" .value=${this.toUnit}
                        @change=${(e: CustomEvent) => { this.toUnit = e.detail.value; this.convert(); }}>
                        ${units.map(u => html`<option value="${u}">${u}</option>`)}
                    </select>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-sm text-gray-600 mb-1">Result:</div>
                    <div class="text-2xl font-bold text-blue-600">${this.result}</div>
                    <t-copy-button .text=${this.result}></t-copy-button>
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