import { html, customElement, property } from 'lit-element';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import hexColorPickerStyles from './hex-color-picker.css.js';
import "../t-copy-button/t-copy-button.js";
import { createRef, ref, Ref } from 'lit/directives/ref.js';

@customElement('hex-color-picker')
export class HexColorPicker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, hexColorPickerStyles];

    @property({ type: String }) hexColor = '#1d4ed8';

    private input: Ref<HTMLInputElement> = createRef();

    connectedCallback() {
        super.connectedCallback();
    }

    private onColorInputChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.hexColor = inputElement.value.toUpperCase();
        this.requestUpdate();
    }

    private isValidHex(hex: string) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    private hexToRgb(hex: string) {
        const bigint = parseInt(hex.substring(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgb(${r}, ${g}, ${b})`;
    }

    private hexToHsl(hex: string) {
        const bigint = parseInt(hex.substring(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        const rNormalized = r / 255;
        const gNormalized = g / 255;
        const bNormalized = b / 255;

        const max = Math.max(rNormalized, gNormalized, bNormalized);
        const min = Math.min(rNormalized, gNormalized, bNormalized);

        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case rNormalized:
                    h = (gNormalized - bNormalized) / d + (gNormalized < bNormalized ? 6 : 0);
                    break;
                case gNormalized:
                    h = (bNormalized - rNormalized) / d + 2;
                    break;
                case bNormalized:
                    h = (rNormalized - gNormalized) / d + 4;
                    break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    render() {
        const rgbColor = this.hexToRgb(this.hexColor);
        const hslColor = this.hexToHsl(this.hexColor);

        return html`
            <div class="hex-color-picker">
                <label for="colorPicker">Pick a color:</label>
                <div class="preview-box" style="background-color: ${this.hexColor};" @click=${() => this.input?.value?.click()}>
                    <input ${ref(this.input)} type="color" .value="${this.hexColor}" @input=${this.onColorInputChange}>
                </div>
                <div class="color-values">
                <p class="res-item">
                    ${this.hexColor}
                    <t-copy-button .text=${this.hexColor}></t-copy-button>
                </p>
                <p>
                    RGB: ${rgbColor}
                    <t-copy-button .text=${rgbColor}></t-copy-button>
                </p>
                <p>
                    HSL: ${hslColor}
                    <t-copy-button .text=${hslColor}></t-copy-button>
                </p>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hex-color-picker': HexColorPicker;
    }
}
