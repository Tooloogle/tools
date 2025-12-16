import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import barcodeGeneratorStyles from './barcode-generator.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { isCanvasSupported, downloadImage } from '../_utils/DomUtils.js';
import JsBarcode from 'jsbarcode';
import { repeat } from 'lit/directives/repeat.js';

interface BarcodeItem {
    id: number;
    text: string;
    format: string;
    error: string;
}

@customElement('barcode-generator')
export class BarcodeGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, barcodeGeneratorStyles];

    @property({ type: String }) inputText = '123456789012';
    @property({ type: String }) format = 'CODE128';
    @state() private barcodes: BarcodeItem[] = [];
    private nextId = 1;

    private generateBarcode(canvas: HTMLCanvasElement, text: string, format: string): string {
        if (!isCanvasSupported() || !canvas || !text) {
            return '';
        }

        try {
            // Clear canvas before generating
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            JsBarcode(canvas, text, {
                format: format,
                displayValue: true,
                fontSize: 14,
                height: 100,
                width: 2,
                margin: 10
            });
            return '';
        } catch (err) {
            // Clear canvas on error
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            return `Error: ${(err as Error).message}`;
        }
    }

    updated(changedProperties: Map<string, unknown>) {
        super.updated(changedProperties);

        // Generate preview barcode
        const canvas = this.shadowRoot?.querySelector('#preview-barcode') as HTMLCanvasElement;

        if (canvas) {
            this.generateBarcode(canvas, this.inputText, this.format);
        }

        // Regenerate all saved barcodes
        this.barcodes.forEach((barcode) => {
            const barcodeCanvas = this.shadowRoot?.querySelector(`#barcode-${barcode.id}`) as HTMLCanvasElement;
            if (barcodeCanvas) {
                const error = this.generateBarcode(barcodeCanvas, barcode.text, barcode.format);
                if (error !== barcode.error) {
                    barcode.error = error;
                    this.requestUpdate();
                }
            }
        });
    }

    private addBarcode() {
        const newBarcode: BarcodeItem = {
            id: this.nextId++,
            text: this.inputText,
            format: this.format,
            error: ''
        };
        this.barcodes = [...this.barcodes, newBarcode];
    }

    private removeBarcode(id: number) {
        this.barcodes = this.barcodes.filter(b => b.id !== id);
    }

    private downloadBarcode(id: number) {
        const canvas = this.shadowRoot?.querySelector(`#barcode-${id}`) as HTMLCanvasElement;
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            downloadImage(`barcode-${id}.png`, dataUrl);
        }
    }

    private downloadPreview() {
        const canvas = this.shadowRoot?.querySelector('#preview-barcode') as HTMLCanvasElement;
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            downloadImage('barcode.png', dataUrl);
        }
    }

    private downloadAllBarcodes() {
        this.barcodes.forEach((barcode) => {
            const canvas = this.shadowRoot?.querySelector(`#barcode-${barcode.id}`) as HTMLCanvasElement;
            if (canvas) {
                const dataUrl = canvas.toDataURL('image/png');
                downloadImage(`barcode-${barcode.id}.png`, dataUrl);
            }
        });
    }

    private handleInputChange(e: Event) {
        this.inputText = (e.target as HTMLInputElement).value;
    }

    private handleFormatChange(e: Event) {
        this.format = (e.target as HTMLSelectElement).value;
    }

    private createDownloadHandler(id: number) {
        return () => this.downloadBarcode(id);
    }

    private createRemoveHandler(id: number) {
        return () => this.removeBarcode(id);
    }

    private renderBarcodeItem(barcode: BarcodeItem) {
        return html`
            <div class="border rounded p-4 bg-gray-50">
                <div class="flex justify-between items-start mb-2">
                    <div class="text-sm">
                        <div><strong>Text:</strong> ${barcode.text}</div>
                        <div><strong>Format:</strong> ${barcode.format}</div>
                    </div>
                    <div class="flex gap-2">
                        <button 
                            class="btn btn-sm btn-green" 
                            @click=${this.createDownloadHandler(barcode.id)}
                            ?disabled=${!!barcode.error}
                        >
                            Download
                        </button>
                        <button 
                            class="btn btn-sm btn-red" 
                            @click=${this.createRemoveHandler(barcode.id)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
                ${barcode.error ? html`
                    <div class="text-red-600 text-sm mb-2">${barcode.error}</div>
                ` : ''}
                <div class="flex justify-center bg-white p-2 rounded">
                    <canvas id="barcode-${barcode.id}"></canvas>
                </div>
            </div>
        `;
    }

    private renderSavedBarcodes() {
        if (this.barcodes.length === 0) {
            return '';
        }

        return html`
            <div class="border-t pt-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Saved Barcodes (${this.barcodes.length})</h3>
                    <button class="btn btn-green" @click=${this.downloadAllBarcodes}>
                        Download All
                    </button>
                </div>
                <div class="space-y-4">
                    ${repeat(this.barcodes, (barcode) => barcode.id, (barcode) => this.renderBarcodeItem(barcode))}
                </div>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Barcode Text:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="Enter text or number..."
                        .value=${this.inputText}
                        @input=${this.handleInputChange}
                    />
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Format:</label>
                    <select class="form-input w-full" .value=${this.format}
                        @change=${this.handleFormatChange}>
                        <option value="CODE128">CODE128</option>
                        <option value="EAN13">EAN-13</option>
                        <option value="EAN8">EAN-8</option>
                        <option value="UPC">UPC</option>
                        <option value="CODE39">CODE39</option>
                    </select>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-2">
                    <button class="btn btn-blue flex-1" @click=${this.addBarcode}>
                        Add to List
                    </button>
                    <button class="btn btn-green flex-1" @click=${this.downloadPreview}>
                        Download Preview
                    </button>
                </div>

                <div class="flex justify-center bg-white p-4 rounded border">
                    <canvas id="preview-barcode"></canvas>
                </div>

                ${this.renderSavedBarcodes()}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'barcode-generator': BarcodeGenerator;
    }
}