import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import svgToPngConverterStyles from './svg-to-png-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-button';
import '../t-input';

@customElement('svg-to-png-converter')
export class SvgToPngConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, svgToPngConverterStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputDataUrl = '';
    @property({ type: String }) errorMessage = '';
    @property({ type: Number }) width = 500;
    @property({ type: Number }) height = 500;

    private handleInput(e: CustomEvent) {
        this.inputText = e.detail.value;
        this.process();
    }

    private handleWidthInput(e: CustomEvent) {
        this.width = parseInt(e.detail.value) || 500;
        this.process();
    }

    private handleHeightInput(e: CustomEvent) {
        this.height = parseInt(e.detail.value) || 500;
        this.process();
    }

    private process() {
        if (!this.inputText.trim()) {
            this.outputDataUrl = '';
            this.errorMessage = '';
            return;
        }

        if (!isBrowser()) {
            this.errorMessage = 'SVG to PNG conversion requires browser environment';
            return;
        }

        try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                this.errorMessage = 'Could not get canvas context';
                return;
            }

            // Create an image from SVG
            const img = new Image();
            const svgBlob = new Blob([this.inputText], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, this.width, this.height);
                this.outputDataUrl = canvas.toDataURL('image/png');
                this.errorMessage = '';
                URL.revokeObjectURL(url);
            };

            img.onerror = () => {
                this.errorMessage = 'Invalid SVG markup';
                URL.revokeObjectURL(url);
            };

            img.src = url;
        } catch (error) {
            this.errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                ${this.renderInputSection()}
                ${this.renderSizeInputs()}
                ${this.renderErrorMessage()}
                ${this.renderOutput()}
            </div>
        `;
    }

    private renderInputSection() {
        return html`
            <div>
                <label class="block mb-2 font-semibold">SVG Input:</label>
                <textarea
                    class="form-input w-full h-48"
                    placeholder="Paste SVG code here..."
                    .value=${this.inputText}
                    @input=${this.handleInput}
                ></textarea>
            </div>
        `;
    }

    private renderSizeInputs() {
        return html`
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block mb-2 font-semibold">Width (px):</label>
                    <t-input type="number" class="w-full"></t-input>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Height (px):</label>
                    <t-input type="number" class="w-full"></t-input>
                </div>
            </div>
        `;
    }

    private renderErrorMessage() {
        return this.errorMessage ? html`
            <div class="p-4 bg-red-100 text-red-700 rounded">
                ${this.errorMessage}
            </div>
        ` : '';
    }

    private renderOutput() {
        return this.outputDataUrl ? html`
            <div>
                <label class="block mb-2 font-semibold">PNG Preview:</label>
                <div class="border p-4 bg-gray-50 rounded">
                    <img src="${this.outputDataUrl}" alt="PNG Preview" class="max-w-full" />
                </div>
                <div class="mt-2">
                    <a 
                        href="${this.outputDataUrl}" 
                        download="converted.png"
                        class="btn btn-primary inline-block"
                    >
                        Download PNG
                    </a>
                </div>
            </div>
        ` : '';
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'svg-to-png-converter': SvgToPngConverter;
    }
}
