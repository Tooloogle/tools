import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import colorNameFinderStyles from './color-name-finder.css.js';
import { customElement, property } from 'lit/decorators.js';
import { cssNamedColors } from './color-data.js';
import '../t-copy-button/index.js';

@customElement('color-name-finder')
export class ColorNameFinder extends WebComponentBase {
    static override styles = [WebComponentBase.styles, colorNameFinderStyles];

    @property()
    hexColor = '#FF0000';

    @property()
    r = 255;

    @property()
    g = 0;

    @property()
    b = 0;

    @property()
    colorName = '';

    override connectedCallback() {
        super.connectedCallback();
        this.findColorName();
    }

    private handleHexChange(e: Event) {
        this.hexColor = (e.target as HTMLInputElement).value;
        this.updateFromHex();
    }

    private handleRGBChange(e: Event, component: 'r' | 'g' | 'b') {
        const value = Number((e.target as HTMLInputElement).value);
        this[component] = Math.max(0, Math.min(255, value));
        this.updateFromRGB();
    }

    private updateFromHex() {
        const hex = this.hexColor.replace('#', '');

        if (hex.length === 6) {
            this.r = parseInt(hex.substring(0, 2), 16);
            this.g = parseInt(hex.substring(2, 4), 16);
            this.b = parseInt(hex.substring(4, 6), 16);
            this.findColorName();
        }
    }

    private updateFromRGB() {
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        this.hexColor = `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
        this.findColorName();
    }

    private findColorName() {
        const hex = this.hexColor.replace('#', '').toUpperCase();
        this.colorName = cssNamedColors[hex] || this.findNearestColorName(hex);
    }

    private findNearestColorName(hex: string): string {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        let minDistance = Infinity;
        let nearestName = 'Unknown';

        for (const [colorHex, name] of Object.entries(cssNamedColors)) {
            const cr = parseInt(colorHex.substring(0, 2), 16);
            const cg = parseInt(colorHex.substring(2, 4), 16);
            const cb = parseInt(colorHex.substring(4, 6), 16);

            const distance = Math.sqrt(
                Math.pow(r - cr, 2) +
                Math.pow(g - cg, 2) +
                Math.pow(b - cb, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestName = name;
            }
        }

        return `~${nearestName}`;
    }

    private handleRChange(e: Event) {
        this.handleRGBChange(e, 'r');
    }

    private handleGChange(e: Event) {
        this.handleRGBChange(e, 'g');
    }

    private handleBChange(e: Event) {
        this.handleRGBChange(e, 'b');
    }

    private renderHexInput() {
        return html`
            <label class="block">
                <span class="inline-block py-1 font-bold">Hex Color</span>
                <div class="flex gap-2 items-center">
                    <input
                        class="h-10 w-16 rounded cursor-pointer"
                        type="color"
                        .value=${this.hexColor}
                        @input=${this.handleHexChange}
                    />
                    <input
                        class="form-input"
                        type="text"
                        .value=${this.hexColor}
                        @input=${this.handleHexChange}
                    />
                </div>
            </label>
        `;
    }

    private renderRGBInputs() {
        return html`
            <div class="grid grid-cols-3 gap-2">
                <label class="block">
                    <span class="inline-block py-1">R</span>
                    <input
                        class="form-input text-end"
                        type="number"
                        min="0"
                        max="255"
                        .value=${String(this.r)}
                        @input=${this.handleRChange}
                    />
                </label>
                <label class="block">
                    <span class="inline-block py-1">G</span>
                    <input
                        class="form-input text-end"
                        type="number"
                        min="0"
                        max="255"
                        .value=${String(this.g)}
                        @input=${this.handleGChange}
                    />
                </label>
                <label class="block">
                    <span class="inline-block py-1">B</span>
                    <input
                        class="form-input text-end"
                        type="number"
                        min="0"
                        max="255"
                        .value=${String(this.b)}
                        @input=${this.handleBChange}
                    />
                </label>
            </div>
        `;
    }

    private renderColorPreview() {
        return html`
            <div class="p-6 rounded" style="background-color: ${this.hexColor};">
                <div class="text-center text-2xl font-bold" style="color: ${this.r + this.g + this.b > 382 ? '#000' : '#FFF'};">
                    ${this.colorName}
                </div>
            </div>

            <div class="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>RGB: (${this.r}, ${this.g}, ${this.b})</span>
                <span>Hex: ${this.hexColor.toUpperCase()}</span>
                <t-copy-button .text=${this.hexColor.toUpperCase()}></t-copy-button>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="space-y-4">
                ${this.renderHexInput()}
                ${this.renderRGBInputs()}
                ${this.renderColorPreview()}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'color-name-finder': ColorNameFinder;
    }
}
