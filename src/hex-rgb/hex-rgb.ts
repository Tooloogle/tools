import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import hexRgbStyles from './hex-rgb.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('hex-rgb')
export class HexRgb extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, hexRgbStyles, inputStyles];

    @property()
    hex = "";

    @property()
    r = 0;

    @property()
    g = 0;

    @property()
    b = 0;

    @property()
    a = 0;

    hexToRgb() {
        if (!this.hex) {
            return;
        }

        const hex = this.hex.replace("#", "");
        this.r = this.stringToDec(hex.substring(0, 2));
        this.g = this.stringToDec(hex.substring(2, 4));
        this.b = this.stringToDec(hex.substring(4, 6));
    }

    rgbToHex() {
        const hex = this.b | (this.g << 8) | (this.r << 16);
        this.hex = `#${(0x1000000 + hex).toString(16).slice(1)}`;
    }

    stringToDec(val: string) {
        const n = parseInt(val, 16);
        if (isNaN(n)) {
            return 0;
        }

        return n
    }

    validateAndParseRGBValue(val: string) {
        const v = this.stringToDec(val);
        if (v < 0) {
            return 0;
        } else if (v > 255) {
            return 255;
        }

        return v;
    }

    private onHexInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.hex = input.value;
    this.hexToRgb();
    }

    private onRInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.r = this.validateAndParseRGBValue(input.value);
        this.rgbToHex();
    }

    private onGInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.g = this.validateAndParseRGBValue(input.value);
        this.rgbToHex();
    }

    private onBInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.b = this.validateAndParseRGBValue(input.value);
        this.rgbToHex();
    }

    override render() {
    return html`
        <div class="py-2">
            <lable class="block">
                <span class="inline-block py-1">Hex</span>
                <input 
                    placeholder="Hex value"
                    class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm" 
                    .value=${this.hex}
                    @keyup=${this.onHexInput} />
            </lable>
        </div>
        <lable class="block">
            <span class="inline-block">RGB</span>
            <div class="grid grid-cols-3 gap-1">
                <input 
                    placeholder="Custom format"
                    class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm" 
                    .value=${this.r}
                    @keyup=${this.onRInput} />
                    
                <input 
                    placeholder="Custom format"
                    class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm" 
                    .value=${this.g}
                    @keyup=${this.onGInput} />

                <input 
                    placeholder="Custom format"
                    class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm"
                    .value=${this.b}
                    @keyup=${this.onBInput} />
            </div>
        </lable>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hex-rgb': HexRgb;
    }
}
