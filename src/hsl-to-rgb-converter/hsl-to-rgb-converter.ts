import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import hslToRgbConverterStyles from './hsl-to-rgb-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';

@customElement('hsl-to-rgb-converter')
export class HslToRgbConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    hslToRgbConverterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) error = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  // eslint-disable-next-line complexity
  private hslToRgb(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    const rVal = Math.round((r + m) * 255);
    const gVal = Math.round((g + m) * 255);
    const bVal = Math.round((b + m) * 255);

    return `rgb(${rVal}, ${gVal}, ${bVal})`;
  }

  private process() {
    this.error = '';

    if (!this.inputText) {
      this.outputText = '';
      return;
    }

    try {
      const match = this.inputText.match(
        /hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i
      );
      if (!match) {
        this.error = 'Invalid HSL format. Use: hsl(360, 100%, 50%)';
        this.outputText = '';
        return;
      }

      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const l = parseInt(match[3]);

      this.outputText = this.hslToRgb(h, s, l);
    } catch (err) {
      this.error = 'Error converting HSL to RGB';
      this.outputText = '';
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">HSL Input:</label>
          <t-textarea placeholder="Enter HSL color (e.g., hsl(360, 100%, 50%))..." class="w-full h-32"></t-textarea>
        </div>
        ${this.error
          ? html`<div class="text-red-600 text-sm">${this.error}</div>`
          : ''}
        <div>
          <label class="block mb-2 font-semibold">RGB Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hsl-to-rgb-converter': HslToRgbConverter;
  }
}
