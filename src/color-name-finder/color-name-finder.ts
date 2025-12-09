import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import colorNameFinderStyles from './color-name-finder.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input';

// Basic color names mapping
const colorNames: { [key: string]: string } = {
    'FF0000': 'Red', '00FF00': 'Green', '0000FF': 'Blue',
    'FFFF00': 'Yellow', 'FF00FF': 'Magenta', '00FFFF': 'Cyan',
    'FFFFFF': 'White', '000000': 'Black', '808080': 'Gray',
    'C0C0C0': 'Silver', '800000': 'Maroon', '808000': 'Olive',
    '008000': 'Dark Green', '800080': 'Purple', '008080': 'Teal',
    '000080': 'Navy', 'FFA500': 'Orange', 'FFC0CB': 'Pink',
    'A52A2A': 'Brown', 'FFD700': 'Gold', 'F0E68C': 'Khaki'
};

@customElement('color-name-finder')
export class ColorNameFinder extends WebComponentBase<IConfigBase> {
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

    connectedCallback() {
        super.connectedCallback();
        this.findColorName();
    }

    private handleHexChange(e: CustomEvent) {
        this.hexColor = e.detail.value;
        this.updateFromHex();
    }

    private handleRGBChange(e: CustomEvent, component: 'r' | 'g' | 'b') {
        const value = Number(e.detail.value);
        this[component] = Math.max(0, Math.min(255, value));
        this.updateFromRGB();
    }

    private updateFromHex() {
        const hex = this.hexColor.replace('#', '');

        if (hex.length === 6) {
            this.r = parseInt(hex.substr(0, 2), 16);
            this.g = parseInt(hex.substr(2, 2), 16);
            this.b = parseInt(hex.substr(4, 2), 16);
            this.findColorName();
        }
    }

    private updateFromRGB() {
        const toHex = (n: number) => {
            const hex = n.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        };

        this.hexColor = `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
        this.findColorName();
    }

    private findColorName() {
        const hex = this.hexColor.replace('#', '').toUpperCase();
        this.colorName = colorNames[hex] || this.findNearestColorName(hex);
    }

    private findNearestColorName(hex: string): string {
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        let minDistance = Infinity;
        let nearestName = 'Unknown';

        for (const [colorHex, name] of Object.entries(colorNames)) {
            const cr = parseInt(colorHex.substr(0, 2), 16);
            const cg = parseInt(colorHex.substr(2, 2), 16);
            const cb = parseInt(colorHex.substr(4, 2), 16);

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

    private handleRChange(e: CustomEvent) {
        this.handleRGBChange(e, 'r');
    }

    private handleGChange(e: CustomEvent) {
        this.handleRGBChange(e, 'g');
    }

    private handleBChange(e: CustomEvent) {
        this.handleRGBChange(e, 'b');
    }

    private renderHexInput() {
        return html`
            <label class="block">
                <span class="inline-block py-1 font-bold">Hex Color</span>
                <t-input type="color" .value=${String(this.hexColor)} @t-input=${this.handleHexChange}></t-input>
                <t-input class="mt-2"></t-input>
            </label>
        `;
    }

    private renderRGBInputs() {
        return html`
            <div class="grid grid-cols-3 gap-2">
                <label class="block">
                    <span class="inline-block py-1">R</span>
                    <t-input type="number" class="text-end"></t-input>
                </label>
                <label class="block">
                    <span class="inline-block py-1">G</span>
                    <t-input type="number" class="text-end"></t-input>
                </label>
                <label class="block">
                    <span class="inline-block py-1">B</span>
                    <t-input type="number" class="text-end"></t-input>
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

            <div class="text-center">
                <div class="text-sm text-gray-600">RGB: (${this.r}, ${this.g}, ${this.b})</div>
                <div class="text-sm text-gray-600">Hex: ${this.hexColor.toUpperCase()}</div>
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
