import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import loremPicsumPlaceholderStyles from './lorem-picsum-placeholder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('lorem-picsum-placeholder')
export class LoremPicsumPlaceholder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, loremPicsumPlaceholderStyles];

    @property({ type: Number }) width = 300;
    @property({ type: Number }) height = 200;
    @property({ type: String }) imageId = '';
    @property({ type: Boolean }) grayscale = false;
    @property({ type: Boolean }) blurEffect = false;
    @property({ type: Number }) blurAmount = 5;

    private handleWidthChange(e: Event) {
        this.width = Number((e.target as HTMLInputElement).value) || 300;
    }

    private handleHeightChange(e: Event) {
        this.height = Number((e.target as HTMLInputElement).value) || 200;
    }

    private handleImageIdChange(e: Event) {
        this.imageId = (e.target as HTMLInputElement).value;
    }

    private handleGrayscaleChange(e: Event) {
        this.grayscale = (e.target as HTMLInputElement).checked;
    }

    private handleBlurChange(e: Event) {
        this.blurEffect = (e.target as HTMLInputElement).checked;
    }

    private handleBlurAmountChange(e: Event) {
        this.blurAmount = Number((e.target as HTMLInputElement).value);
    }

    private generateUrl(): string {
        let url = 'https://picsum.photos';

        if (this.imageId) {
            url += `/id/${this.imageId}`;
        }

        url += `/${this.width}/${this.height}`;

        const params: string[] = [];
        if (this.grayscale) {
            params.push('grayscale');
        }

        if (this.blurEffect) {
            params.push(`blur=${this.blurAmount}`);
        }

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        return url;
    }

    override render() {
        const imageUrl = this.generateUrl();

        return html`
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold">Width (px):</label>
                        <input type="number" class="form-input w-full" min="1" max="5000"
                            .value=${String(this.width)} @input=${this.handleWidthChange} />
                    </div>
                    <div>
                        <label class="block mb-2 font-semibold">Height (px):</label>
                        <input type="number" class="form-input w-full" min="1" max="5000"
                            .value=${String(this.height)} @input=${this.handleHeightChange} />
                    </div>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Specific Image ID (optional):</label>
                    <input type="text" class="form-input w-full" placeholder="e.g., 237 (leave empty for random)"
                        .value=${this.imageId} @input=${this.handleImageIdChange} />
                </div>
                <div class="space-y-2">
                    <label class="block">
                        <input type="checkbox" .checked=${this.grayscale} @change=${this.handleGrayscaleChange} />
                        <span class="ml-2">Grayscale</span>
                    </label>
                    <label class="block">
                        <input type="checkbox" .checked=${this.blurEffect} @change=${this.handleBlurChange} />
                        <span class="ml-2">Blur</span>
                    </label>
                    ${this.blurEffect ? html`
                        <div class="ml-6">
                            <label class="block mb-2 font-semibold">Blur Amount (1-10): ${this.blurAmount}</label>
                            <input type="range" min="1" max="10" class="w-full"
                                .value=${String(this.blurAmount)} @input=${this.handleBlurAmountChange} />
                        </div>
                    ` : ''}
                </div>
                <div class="p-4 bg-gray-100 rounded">
                    <p class="font-bold mb-2">Generated URL:</p>
                    <div class="flex gap-2">
                        <input type="text" class="form-input font-mono text-sm flex-1" readonly .value=${imageUrl} />
                        <t-copy-button .isIcon=${false} .text=${imageUrl}></t-copy-button>
                    </div>
                </div>
                <div class="p-4 bg-white border rounded text-center">
                    <p class="font-bold mb-2">Preview:</p>
                    <img src="${imageUrl}" alt="Lorem Picsum placeholder" class="max-w-full h-auto mx-auto" style="max-height: 400px;" />
                </div>
                <div class="text-sm text-gray-600">
                    <p><strong>Note:</strong> Lorem Picsum provides free placeholder images.</p>
                    <p>Images are served from <a href="https://picsum.photos" target="_blank" class="text-blue-600 hover:underline">picsum.photos</a></p>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lorem-picsum-placeholder': LoremPicsumPlaceholder;
    }
}
