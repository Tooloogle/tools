import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssColorConverterStyles from './css-color-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';
import {
  ColorFormat,
  Rgba,
  parseHex,
  parseHsl,
  parseRgb,
  toHex,
  toHsl,
  toRgb,
} from './color-utils.js';

@customElement('css-color-converter')
export class CssColorConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    cssColorConverterStyles];

  @property({ type: String }) hexInput = '';
  @property({ type: String }) rgbInput = '';
  @property({ type: String }) hslInput = '';
  @property({ type: String }) error = '';
  @property({ type: String }) previewColor = 'transparent';
  @property({ type: String }) pickerColor = '#000000';

  private alpha = 1;

  private handleHexInput(e: Event) {
    this.hexInput = (e.target as HTMLInputElement).value;
    this.syncFrom('hex');
  }

  private handleRgbInput(e: Event) {
    this.rgbInput = (e.target as HTMLInputElement).value;
    this.syncFrom('rgb');
  }

  private handleHslInput(e: Event) {
    this.hslInput = (e.target as HTMLInputElement).value;
    this.syncFrom('hsl');
  }

  private handlePicker(e: Event) {
    const base = parseHex((e.target as HTMLInputElement).value);
    if (!base) {
      return;
    }

    this.apply({ ...base, a: this.alpha }, 'all');
  }

  private syncFrom(source: ColorFormat) {
    this.error = '';

    const raw =
      source === 'hex'
        ? this.hexInput
        : source === 'rgb'
          ? this.rgbInput
          : this.hslInput;

    if (!raw.trim()) {
      this.clearExcept(source);
      this.resetPreview();
      return;
    }

    const rgba =
      source === 'hex'
        ? parseHex(raw)
        : source === 'rgb'
          ? parseRgb(raw)
          : parseHsl(raw);

    if (!rgba) {
      this.error = this.errorFor(source);
      this.clearExcept(source);
      this.resetPreview();
      return;
    }

    this.apply(rgba, source);
  }

  private apply(rgba: Rgba, source: ColorFormat | 'all') {
    if (source !== 'hex') {
      this.hexInput = toHex(rgba);
    }

    if (source !== 'rgb') {
      this.rgbInput = toRgb(rgba);
    }

    if (source !== 'hsl') {
      this.hslInput = toHsl(rgba);
    }

    this.alpha = rgba.a;
    this.previewColor = toRgb(rgba);
    this.pickerColor = toHex({ ...rgba, a: 1 });
  }

  private resetPreview() {
    this.alpha = 1;
    this.previewColor = 'transparent';
    this.pickerColor = '#000000';
  }

  private clearExcept(source: ColorFormat) {
    if (source !== 'hex') {
      this.hexInput = '';
    }

    if (source !== 'rgb') {
      this.rgbInput = '';
    }

    if (source !== 'hsl') {
      this.hslInput = '';
    }
  }

  private errorFor(source: ColorFormat): string {
    if (source === 'hex') {
      return 'Invalid HEX. Use: #ff0000, #f00 or #ff000080';
    }

    if (source === 'rgb') {
      return 'Invalid RGB. Use: rgb(255, 0, 0) or rgba(255, 0, 0, 0.5)';
    }

    return 'Invalid HSL. Use: hsl(0, 100%, 50%) or hsla(0, 100%, 50%, 0.5)';
  }

  private renderField(
    label: string,
    placeholder: string,
    value: string,
    handler: (e: Event) => void
  ) {
    return html`
      <div>
        <label class="block mb-2 font-semibold">${label}:</label>
        <div class="flex items-center gap-3">
          <input
            type="text"
            class="form-input w-full"
            placeholder=${placeholder}
            .value=${value}
            @input=${handler}
          />
          <t-copy-button
            .isIcon=${true}
            .disabled=${!value}
            .text=${value}
          ></t-copy-button>
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div
          class="checkerboard relative h-16 rounded border border-gray-300 dark:border-gray-600 overflow-hidden"
        >
          <div
            class="absolute inset-0"
            style="background-color: ${this.previewColor}"
          ></div>
          <input
            type="color"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Pick a color"
            .value=${this.pickerColor}
            @input=${this.handlePicker}
          />
        </div>
        ${this.renderField(
          'HEX',
          'e.g., #ff0000 or #ff000080',
          this.hexInput,
          this.handleHexInput
        )}
        ${this.renderField(
          'RGB',
          'e.g., rgb(255, 0, 0) or rgba(255, 0, 0, 0.5)',
          this.rgbInput,
          this.handleRgbInput
        )}
        ${this.renderField(
          'HSL',
          'e.g., hsl(0, 100%, 50%) or hsla(0, 100%, 50%, 0.5)',
          this.hslInput,
          this.handleHslInput
        )}
        ${this.error
          ? html`<div class="text-red-600 dark:text-red-400 text-sm">
              ${this.error}
            </div>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'css-color-converter': CssColorConverter;
  }
}
