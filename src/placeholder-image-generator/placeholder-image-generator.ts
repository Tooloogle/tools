import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import placeholderImageGeneratorStyles from './placeholder-image-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';
import '../t-input/t-input.js';
import '../t-select';

@customElement('placeholder-image-generator')
export class PlaceholderImageGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, placeholderImageGeneratorStyles];

    @property()
    width = 300;

    @property()
    height = 200;

    @property()
    text = '';

    @property()
    bgColor = 'cccccc';

    @property()
    textColor = '333333';

    @property()
    format = 'png';

    @property()
    service = 'placehold';

    private handleWidthChange(e: CustomEvent) {
        this.width = parseInt(e.detail.value) || 300;
    }

    private handleHeightChange(e: CustomEvent) {
        this.height = parseInt(e.detail.value) || 200;
    }

    private handleTextChange(e: CustomEvent) {
        this.text = e.detail.value;
    }

    private handleBgColorChange(e: CustomEvent) {
        this.bgColor = e.detail.value.replace('#', '');
    }

    private handleTextColorChange(e: CustomEvent) {
        this.textColor = e.detail.value.replace('#', '');
    }

    private handleFormatChange(e: CustomEvent) {
        this.format = e.detail.value;
    }

    private handleServiceChange(e: CustomEvent) {
        this.service = e.detail.value;
    }

    private handleBgColorInputChange(e: CustomEvent) {
        this.bgColor = e.detail.value;
    }

    private handleTextColorInputChange(e: CustomEvent) {
        this.textColor = e.detail.value;
    }

    private getPlaceholderUrl(): string {
        const displayText = this.text || `${this.width}x${this.height}`;
        
        switch (this.service) {
            case 'placehold':
                return `https://placehold.co/${this.width}x${this.height}/${this.bgColor}/${this.textColor}/${this.format}?text=${encodeURIComponent(displayText)}`;
            case 'dummyimage':
                return `https://dummyimage.com/${this.width}x${this.height}/${this.bgColor}/${this.textColor}&text=${encodeURIComponent(displayText)}`;
            case 'picsum':
                return `https://picsum.photos/${this.width}/${this.height}`;
            default:
                return '';
        }
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        const url = this.getPlaceholderUrl();

        return html`
            <div class="space-y-4 py-2">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Service:</span>
                    <t-select .value=${String(this.service)} @t-change=${this.handleServiceChange}>
                        <option value="placehold">Placehold.co</option>
                        <option value="dummyimage">Dummy Image</option>
                        <option value="picsum">Lorem Picsum (Random Photos)</option>
                    </t-select>
                </label>

                <div class="grid grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Width:</span>
                        <t-input type="number" .value=${String(this.width)} @t-input=${this.handleWidthChange}></t-input>
                    </label>

                    <label class="block">
                        <span class="inline-block py-1 font-bold">Height:</span>
                        <t-input type="number" .value=${String(this.height)} @t-input=${this.handleHeightChange}></t-input>
                    </label>
                </div>

                ${this.service !== 'picsum' ? html`
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Custom Text (optional):</span>
                        <t-input placeholder="Leave empty for default" .value=${this.text} @t-input=${this.handleTextChange}></t-input>
                    </label>

                    <div class="grid grid-cols-2 gap-4">
                        <label class="block">
                            <span class="inline-block py-1 font-bold">Background Color:</span>
                            <div class="flex gap-2">
                                <input
                                    type="color"
                                    .value=${`#${  this.bgColor}`}
                                    @input=${this.handleBgColorChange}
                                    class="h-10 w-16"
                                />
                                <t-input .value=${this.bgColor} @t-input=${this.handleBgColorInputChange}></t-input>
                            </div>
                        </label>

                        <label class="block">
                            <span class="inline-block py-1 font-bold">Text Color:</span>
                            <div class="flex gap-2">
                                <input
                                    type="color"
                                    .value=${`#${  this.textColor}`}
                                    @input=${this.handleTextColorChange}
                                    class="h-10 w-16"
                                />
                                <t-input .value=${this.textColor} @t-input=${this.handleTextColorInputChange}></t-input>
                            </div>
                        </label>
                    </div>

                    <label class="block">
                        <span class="inline-block py-1 font-bold">Format:</span>
                        <t-select .value=${String(this.format)} @t-change=${this.handleFormatChange}>
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="gif">GIF</option>
                            <option value="webp">WebP</option>
                        </t-select>
                    </label>
                ` : ''}

                <div class="p-4 bg-gray-100 rounded">
                    <p class="font-bold mb-2">Generated URL:</p>
                    <div class="flex gap-2">
                        <t-input ?readonly=${true} class="font-mono text-sm" .value=${url}></t-input>
                        <t-copy-button .isIcon=${false} .text=${url}></t-copy-button>
                    </div>
                </div>

                <div class="p-4 bg-white border rounded text-center">
                    <p class="font-bold mb-2">Preview:</p>
                    <img src="${url}" alt="Placeholder preview" class="max-w-full h-auto mx-auto" />
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'placeholder-image-generator': PlaceholderImageGenerator;
    }
}
