import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import rgbToHslConverterStyles from './rgb-to-hsl-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';

@customElement('rgb-to-hsl-converter')
export class RgbToHslConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    rgbToHslConverterStyles,
  ];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) error = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    this.error = '';

    if (!this.inputText) {
      this.outputText = '';
      return;
    }

    try {
      const match = this.inputText.match(
        /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i
      );
      if (!match) {
        this.error = 'Invalid RGB format. Use: rgb(255, 128, 0)';
        this.outputText = '';
        return;
      }

      const r = parseInt(match[1]) / 255;
      const g = parseInt(match[2]) / 255;
      const b = parseInt(match[3]) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      let h = 0;
      let s = 0;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }

      const hDeg = Math.round(h * 360);
      const sPercent = Math.round(s * 100);
      const lPercent = Math.round(l * 100);

      this.outputText = `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)`;
    } catch (err) {
      this.error = 'Error converting RGB to HSL';
      this.outputText = '';
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">RGB Input:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter RGB color (e.g., rgb(255, 128, 0))..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        ${this.error
          ? html`<div class="text-red-600 text-sm">${this.error}</div>`
          : ''}
        <div>
          <label class="block mb-2 font-semibold">HSL Output:</label>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
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
    'rgb-to-hsl-converter': RgbToHslConverter;
  }
}
