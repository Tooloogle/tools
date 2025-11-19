import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import svgToPngConverterStyles from './svg-to-png-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { isBrowser } from '../_utils/DomUtils.js';

@customElement('svg-to-png-converter')
export class SvgToPngConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, svgToPngConverterStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputDataUrl = '';
    @property({ type: String }) errorMessage = '';
    @property({ type: Number }) width = 500;
    @property({ type: Number }) height = 500;

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private handleWidthInput(e: Event) {
        this.width = parseInt((e.target as HTMLInputElement).value) || 500;
        this.process();
    }

    private handleHeightInput(e: Event) {
        this.height = parseInt((e.target as HTMLInputElement).value) || 500;
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
                <div>
                    <label class="block mb-2 font-semibold">SVG Input:</label>
                    <textarea
                        class="form-input w-full h-48"
                        placeholder="Paste SVG code here..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold">Width (px):</label>
                        <input
                            type="number"
                            class="form-input w-full"
                            .value=${this.width.toString()}
                            @input=${this.handleWidthInput}
                            min="1"
                            max="5000"
                        />
                    </div>
                    <div>
                        <label class="block mb-2 font-semibold">Height (px):</label>
                        <input
                            type="number"
                            class="form-input w-full"
                            .value=${this.height.toString()}
                            @input=${this.handleHeightInput}
                            min="1"
                            max="5000"
                        />
                    </div>
                </div>

                ${this.errorMessage ? html`
                    <div class="p-4 bg-red-100 text-red-700 rounded">
                        ${this.errorMessage}
                    </div>
                ` : ''}

                ${this.outputDataUrl ? html`
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
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'svg-to-png-converter': SvgToPngConverter;
    }
}
