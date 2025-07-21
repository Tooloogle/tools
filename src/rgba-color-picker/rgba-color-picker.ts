import { html, customElement, property } from 'lit-element';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import rgbaColorPickerStyles from './rgba-color-picker.css.js'; // Updated import for CSS styles
import "../t-copy-button/t-copy-button.js";
import { createRef, ref, Ref } from 'lit/directives/ref.js';

@customElement('rgba-color-picker')
export class RgbaColorPicker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, rgbaColorPickerStyles];

    @property({ type: String }) color = 'rgba(255, 0, 0, 1)'; // Default color
    @property({ type: Number }) red = 255;
    @property({ type: Number }) green = 0;
    @property({ type: Number }) blue = 0;
    @property({ type: Number }) alpha = 1;

    private colorInputEl: Ref<HTMLInputElement> = createRef();

    connectedCallback() {
        super.connectedCallback();
    }

    private onColorInputChange(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            this.color = this.hexToRgb(event.target.value);
            this.updateRGBAValues();
            this.requestUpdate();
        }
    }

    private updateRGBAValues() {
        const rgbaArray = this.color.substring(5, this.color.length - 1).split(',');
        this.red = parseInt(rgbaArray[0].trim());
        this.green = parseInt(rgbaArray[1].trim());
        this.blue = parseInt(rgbaArray[2].trim());
        this.alpha = parseFloat(rgbaArray[3].trim());
    }

    private onRedChange(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            this.red = parseInt(event.target.value);
            this.updateColorFromRGBAValues();
            this.requestUpdate();
        }
    }

    private onGreenChange(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            this.green = parseInt(event.target.value);
            this.updateColorFromRGBAValues();
            this.requestUpdate();
        }
    }

    private onBlueChange(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            this.blue = parseInt(event.target.value);
            this.updateColorFromRGBAValues();
            this.requestUpdate();
        }
    }

    private onAlphaChange(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            this.alpha = parseFloat(event.target.value);
            this.updateColorFromRGBAValues();
            this.requestUpdate();
        }
    }

    private updateColorFromRGBAValues() {
        this.color = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    private rgbToHex(r: number, g: number, b: number) {
        const toHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    private rgbToHsl(r: number, g: number, b: number) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0,
            s = 0,
            l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    private hexToRgb(hex: string) {
        const bigint = parseInt(hex.substring(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgb(${r}, ${g}, ${b})`;
    }

    private onPreviewBoxClick() {
        if (this.colorInputEl?.value) {
            this.colorInputEl.value.click();
        }
    }

    render() {
        const hexColor = this.rgbToHex(this.red, this.green, this.blue);
        const hslColor = this.rgbToHsl(this.red, this.green, this.blue);

        return html`
      <div class="rgba-color-picker">
        <label for="colorPicker">Pick a color:</label>
        <div class="preview-box" style="background-color: ${this.color};" @click=${this.onPreviewBoxClick}>
            <input ${ref(this.colorInputEl)} id="colorPicker" type="color" .value="${this.color}" @input=${this.onColorInputChange}>
        </div>
        
        <div class="rgba-sliders">
          <label for="redSlider">Red:</label>
          <input id="redSlider" type="range" min="0" max="255" .value="${this.red}" @input="${this.onRedChange}">
          <input type="number" .value="${this.red}" @input="${this.onRedChange}">

          <label for="greenSlider">Green:</label>
          <input id="greenSlider" type="range" min="0" max="255" .value="${this.green}" @input="${this.onGreenChange}">
          <input type="number" .value="${this.green}" @input="${this.onGreenChange}">

          <label for="blueSlider">Blue:</label>
          <input id="blueSlider" type="range" min="0" max="255" .value="${this.blue}" @input="${this.onBlueChange}">
          <input type="number" .value="${this.blue}" @input="${this.onBlueChange}">

          <label for="alphaSlider">Alpha:</label>
          <input id="alphaSlider" type="range" min="0" max="1" step="0.01" .value="${this.alpha}" @input="${this.onAlphaChange}">
          <input type="number" .value="${this.alpha}" @input="${this.onAlphaChange}">
        </div>

        <div class="rgba-values">
          <p class="res-item">
            ${this.color}
            <t-copy-button .text=${this.color}></t-copy-button>
          </p>

          <p>
            RGB: ${hexColor}
            <t-copy-button .text=${hexColor}></t-copy-button>
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
        'rgba-color-picker': RgbaColorPicker;
    }
}
