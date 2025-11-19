import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import placeholderImageGeneratorStyles from './placeholder-image-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('placeholder-image-generator')
export class PlaceholderImageGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, placeholderImageGeneratorStyles];

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

    private handleWidthChange(e: Event) {
        this.width = parseInt((e.target as HTMLInputElement).value) || 300;
    }

    private handleHeightChange(e: Event) {
        this.height = parseInt((e.target as HTMLInputElement).value) || 200;
    }

    private handleTextChange(e: Event) {
        this.text = (e.target as HTMLInputElement).value;
    }

    private handleBgColorChange(e: Event) {
        this.bgColor = (e.target as HTMLInputElement).value.replace('#', '');
    }

    private handleTextColorChange(e: Event) {
        this.textColor = (e.target as HTMLInputElement).value.replace('#', '');
    }

    private handleFormatChange(e: Event) {
        this.format = (e.target as HTMLSelectElement).value;
    }

    private handleServiceChange(e: Event) {
        this.service = (e.target as HTMLSelectElement).value;
    }

    private handleBgColorInputChange(e: Event) {
        this.bgColor = (e.target as HTMLInputElement).value;
    }

    private handleTextColorInputChange(e: Event) {
        this.textColor = (e.target as HTMLInputElement).value;
    }

    private getPlaceholderUrl(): string {
        const displayText = this.text || `${this.width}x${this.height}`;
        
        switch (this.service) {
            case 'placehold':
                return `https://placehold.co/${this.width}x${this.height}/${this.bgColor}/${this.textColor}/${this.format}?text=${encodeURIComponent(displayText)}`;
            case 'placeholder':
                return `https://via.placeholder.com/${this.width}x${this.height}/${this.bgColor}/${this.textColor}?text=${encodeURIComponent(displayText)}`;
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
                    <select
                        class="form-select"
                        .value=${this.service}
                        @change=${this.handleServiceChange}
                    >
                        <option value="placehold">Placehold.co</option>
                        <option value="placeholder">via Placeholder</option>
                        <option value="dummyimage">Dummy Image</option>
                        <option value="picsum">Lorem Picsum (Random Photos)</option>
                    </select>
                </label>

                <div class="grid grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Width:</span>
                        <input
                            type="number"
                            class="form-input"
                            min="1"
                            max="2000"
                            .value=${String(this.width)}
                            @input=${this.handleWidthChange}
                        />
                    </label>

                    <label class="block">
                        <span class="inline-block py-1 font-bold">Height:</span>
                        <input
                            type="number"
                            class="form-input"
                            min="1"
                            max="2000"
                            .value=${String(this.height)}
                            @input=${this.handleHeightChange}
                        />
                    </label>
                </div>

                ${this.service !== 'picsum' ? html`
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Custom Text (optional):</span>
                        <input
                            type="text"
                            class="form-input"
                            placeholder="Leave empty for default"
                            .value=${this.text}
                            @input=${this.handleTextChange}
                        />
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
                                <input
                                    type="text"
                                    class="form-input"
                                    .value=${this.bgColor}
                                    @input=${this.handleBgColorInputChange}
                                    maxlength="6"
                                />
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
                                <input
                                    type="text"
                                    class="form-input"
                                    .value=${this.textColor}
                                    @input=${this.handleTextColorInputChange}
                                    maxlength="6"
                                />
                            </div>
                        </label>
                    </div>

                    <label class="block">
                        <span class="inline-block py-1 font-bold">Format:</span>
                        <select
                            class="form-select"
                            .value=${this.format}
                            @change=${this.handleFormatChange}
                        >
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="gif">GIF</option>
                            <option value="webp">WebP</option>
                        </select>
                    </label>
                ` : ''}

                <div class="p-4 bg-gray-100 rounded">
                    <p class="font-bold mb-2">Generated URL:</p>
                    <div class="flex gap-2">
                        <input
                            type="text"
                            class="form-input font-mono text-sm"
                            readonly
                            .value=${url}
                        />
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
