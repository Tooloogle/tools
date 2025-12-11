import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import hexRgbStyles from './hex-rgb.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-input';

@customElement('hex-rgb')
export class HexRgb extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, hexRgbStyles];

  @property()
  hex = '';

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

    const hex = this.hex.replace('#', '');
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

    return n;
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

  private onHexInput(e: CustomEvent) {
    this.hex = e.detail.value;
    this.hexToRgb();
  }

  private onRInput(e: CustomEvent) {
    this.r = this.validateAndParseRGBValue(e.detail.value);
    this.rgbToHex();
  }

  private onGInput(e: CustomEvent) {
    this.g = this.validateAndParseRGBValue(e.detail.value);
    this.rgbToHex();
  }

  private onBInput(e: CustomEvent) {
    this.b = this.validateAndParseRGBValue(e.detail.value);
    this.rgbToHex();
  }

  override render() {
    return html`
      <div class="py-2">
        <label class="block">
          <span class="inline-block py-1">Hex</span>
          <t-input
            placeholder="Hex value"
            class="text-end w-full sm:w-3/4 md:w-1/3 text-sm"
            .value=${this.hex}
            @t-input=${this.onHexInput}
          ></t-input>
        </label>
      </div>
      <label class="block">
        <span class="inline-block">RGB</span>
        <div class="grid grid-cols-3 gap-1">
          <t-input
            placeholder="Custom format"
            class="text-end w-full sm:w-3/4 md:w-1/3 text-sm"
            .value=${this.r}
            @t-input=${this.onRInput}
          ></t-input>

          <t-input
            placeholder="Custom format"
            class="text-end w-full sm:w-3/4 md:w-1/3 text-sm"
            .value=${this.g}
            @t-input=${this.onGInput}
          ></t-input>

          <t-input
            placeholder="Custom format"
            class="text-end w-full sm:w-3/4 md:w-1/3 text-sm"
            .value=${this.b}
            @t-input=${this.onBInput}
          ></t-input>
        </div>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hex-rgb': HexRgb;
  }
}
