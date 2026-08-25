import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import colorLuminanceCalculatorStyles from './color-luminance-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('color-luminance-calculator')
export class ColorLuminanceCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, colorLuminanceCalculatorStyles];

    @property()
    color = '#000000';

    @property()
    luminance = 0;

    @property()
    brightness = 0;

    @property()
    textColor = '#ffffff';

    /**
     * Calculate relative luminance using WCAG 2.0 formula
     * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
     * @param hex - Hex color code
     * @returns Relative luminance value between 0 and 1
     */
    private calculateLuminance(hex: string): number {
        const rgb = this.hexToRgb(hex);
        if (!rgb) {return 0;}

        const rsRGB = rgb.r / 255;
        const gsRGB = rgb.g / 255;
        const bsRGB = rgb.b / 255;

        const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Calculate perceived brightness using ITU-R BT.601 luma coefficients
     * Formula: (0.299 * R + 0.587 * G + 0.114 * B)
     * @param hex - Hex color code
     * @returns Brightness value between 0 and 255
     */
    private calculateBrightness(hex: string): number {
        const rgb = this.hexToRgb(hex);
        if (!rgb) {return 0;}

        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    private updateCalculations() {
        this.luminance = this.calculateLuminance(this.color);
        this.brightness = this.calculateBrightness(this.color);
        this.textColor = this.brightness > 127.5 ? '#000000' : '#ffffff';
    }

    private handleColorChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.color = target.value;
        this.updateCalculations();
    }

    override firstUpdated() {
        this.updateCalculations();
    }

    override render() {
        const luminancePercent = (this.luminance * 100).toFixed(2);
        const brightnessPercent = ((this.brightness / 255) * 100).toFixed(2);

        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="inline-block py-1">Color</span>
                    <div class="flex gap-2">
                        <input
                            type="color"
                            class="form-input w-20 h-12"
                            .value=${this.color}
                            @input=${this.handleColorChange}
                        />
                        <input
                            type="text"
                            class="form-input flex-1"
                            .value=${this.color}
                            @input=${this.handleColorChange}
                            placeholder="#000000"
                            pattern="^#[0-9A-Fa-f]{6}$"
                        />
                    </div>
                </label>

                <div class="p-6 rounded-lg" style="background-color: ${this.color}; color: ${this.textColor};">
                    <p class="text-center text-lg font-semibold">Sample Text Preview</p>
                </div>

                <div class="space-y-2">
                    <div class="p-4 bg-gray-100 rounded">
                        <div class="font-semibold">Relative Luminance (WCAG)</div>
                        <div class="text-2xl">${this.luminance.toFixed(4)}</div>
                        <div class="text-sm text-gray-600">${luminancePercent}%</div>
                    </div>

                    <div class="p-4 bg-gray-100 rounded">
                        <div class="font-semibold">Perceived Brightness</div>
                        <div class="text-2xl">${this.brightness.toFixed(2)}</div>
                        <div class="text-sm text-gray-600">${brightnessPercent}% (0-255 scale)</div>
                    </div>

                    <div class="p-4 bg-gray-100 rounded">
                        <div class="font-semibold">Recommended Text Color</div>
                        <div class="text-2xl" style="color: ${this.textColor};">■</div>
                        <div class="text-sm text-gray-600">${this.textColor}</div>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'color-luminance-calculator': ColorLuminanceCalculator;
    }
}
