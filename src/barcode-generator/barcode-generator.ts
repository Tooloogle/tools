import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import barcodeGeneratorStyles from './barcode-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isCanvasSupported } from '../_utils/DomUtils.js';
import JsBarcode from 'jsbarcode';
import '../t-input';

@customElement('barcode-generator')
export class BarcodeGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, barcodeGeneratorStyles];

    @property({ type: String }) inputText = '123456789012';
    @property({ type: String }) format = 'CODE128';
    @property({ type: String }) error = '';

    private generateBarcode() {
        this.error = '';

        if (!isCanvasSupported()) {
            return;
        }

        const canvas = this.shadowRoot?.querySelector('#barcode') as HTMLCanvasElement;
        if (!canvas || !this.inputText) {
            return;
        }

        try {
            JsBarcode(canvas, this.inputText, {
                format: this.format,
                displayValue: true,
                fontSize: 14,
                height: 100
            });
        } catch (err) {
            this.error = `Error: ${(err as Error).message}`;
        }
    }

    updated() {
        this.generateBarcode();
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Barcode Text:</label>
                    <t-input placeholder="Enter text or number..." class="w-full"></t-input> { this.inputText = e.detail.value; }}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Format:</label>
                    <select class="form-input w-full" .value=${this.format}
                        @change=${(e: CustomEvent) => { this.format = e.detail.value; }}>
                        <option value="CODE128">CODE128</option>
                        <option value="EAN13">EAN-13</option>
                        <option value="EAN8">EAN-8</option>
                        <option value="UPC">UPC</option>
                        <option value="CODE39">CODE39</option>
                    </select>
                </div>
                ${this.error ? html`<div class="text-red-600 text-sm">${this.error}</div>` : ''}
                <div class="flex justify-center bg-white p-4 rounded border">
                    <canvas id="barcode"></canvas>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'barcode-generator': BarcodeGenerator;
    }
}