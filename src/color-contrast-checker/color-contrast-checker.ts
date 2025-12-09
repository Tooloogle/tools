import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import colorContrastCheckerStyles from './color-contrast-checker.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input/t-input.js';

@customElement('color-contrast-checker')
export class ColorContrastChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, colorContrastCheckerStyles];

    @property()
    foreground = '#000000';

    @property()
    background = '#ffffff';

    @property()
    contrastRatio = 21;

    private handleForegroundChange(e: CustomEvent) {
        this.foreground = e.detail.value;
        this.calculateContrast();
    }

    private handleBackgroundChange(e: CustomEvent) {
        this.background = e.detail.value;
        this.calculateContrast();
    }

    private getLuminance(hex: string): number {
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const [rs, gs, bs] = [r, g, b].map(c => {
            const sRGB = c / 255;
            return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    private calculateContrast() {
        const l1 = this.getLuminance(this.foreground);
        const l2 = this.getLuminance(this.background);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        this.contrastRatio = (lighter + 0.05) / (darker + 0.05);
    }

    override connectedCallback() {
        super.connectedCallback();
        this.calculateContrast();
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        const ratio = this.contrastRatio.toFixed(2);
        const passAA = this.contrastRatio >= 4.5;
        const passAALarge = this.contrastRatio >= 3;
        const passAAA = this.contrastRatio >= 7;
        const passAAALarge = this.contrastRatio >= 4.5;

        return html`
            <div class="space-y-4 py-2">
                <div class="grid grid-cols-2 gap-4">
                    <label class="block">
                        <span class="font-bold">Foreground Color:</span>
                        <div class="flex gap-2 mt-1">
                            <input
                                type="color"
                                .value=${this.foreground}
                                @input=${this.handleForegroundChange}
                                class="h-10 w-16"
                            />
                            <t-input></t-input>
                        </div>
                    </label>

                    <label class="block">
                        <span class="font-bold">Background Color:</span>
                        <div class="flex gap-2 mt-1">
                            <input
                                type="color"
                                .value=${this.background}
                                @input=${this.handleBackgroundChange}
                                class="h-10 w-16"
                            />
                            <t-input></t-input>
                        </div>
                    </label>
                </div>

                <div class="p-4 rounded" style="background-color: ${this.background}; color: ${this.foreground};">
                    <p class="text-lg">Sample Text (Normal Size)</p>
                    <p class="text-2xl font-bold">Sample Text (Large Size)</p>
                </div>

                <div class="p-4 bg-gray-100 rounded">
                    <h3 class="text-2xl font-bold mb-2">Contrast Ratio: ${ratio}:1</h3>
                    
                    <div class="space-y-2 mt-4">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${passAA ? '✓' : '✗'}</span>
                            <span>WCAG AA Normal Text (≥4.5:1)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${passAALarge ? '✓' : '✗'}</span>
                            <span>WCAG AA Large Text (≥3:1)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${passAAA ? '✓' : '✗'}</span>
                            <span>WCAG AAA Normal Text (≥7:1)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${passAAALarge ? '✓' : '✗'}</span>
                            <span>WCAG AAA Large Text (≥4.5:1)</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'color-contrast-checker': ColorContrastChecker;
    }
}
