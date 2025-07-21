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
        this.hex = '#' + (0x1000000 + hex).toString(16).slice(1);
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

    override render() {
        return html`
            <div class="py-2">
                <lable class="block">
                    <span class="inline-block py-1">Hex</span>
                    <input 
                        placeholder="Hex value"
                        class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm" 
                        .value=${this.hex}
                        @keyup=${(e: any) => { this.hex = e.target?.value; this.hexToRgb() }} />
                </lable>
            </div>
            <lable class="block">
                <span class="inline-block">RGB</span>
                <div class="grid grid-cols-3 gap-1">
                    <input 
                        placeholder="Custom format"
                        class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm" 
                        .value=${this.r}
                        @keyup=${(e: any) => { this.r = this.validateAndParseRGBValue(e.target?.value); this.rgbToHex(); }} />
                        
                    <input 
                        placeholder="Custom format"
                        class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm" 
                        .value=${this.g}
                        @keyup=${(e: any) => { this.g = this.validateAndParseRGBValue(e.target?.value); this.rgbToHex(); }} />

                    <input 
                        placeholder="Custom format"
                        class="text-end w-full sm:w-3/4 md:w-1/3 form-input text-sm"
                        .value=${this.b}
                        @keyup=${(e: any) => { this.b = this.validateAndParseRGBValue(e.target?.value); this.rgbToHex(); }} />
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
