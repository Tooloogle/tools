import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import cssBoxShadowGeneratorStyles from './css-box-shadow-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';
@customElement('css-box-shadow-generator')
export class CssBoxShadowGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    cssBoxShadowGeneratorStyles,
  ];

  @property({ type: Number }) offsetX = 0;
  @property({ type: Number }) offsetY = 4;
  @property({ type: Number }) blurRadius = 6;
  @property({ type: Number }) spreadRadius = 0;
  @property({ type: String }) color = '#000000';
  @property({ type: Number }) opacity = 0.3;
  @property({ type: String }) outputText = '';

  connectedCallback() {
    super.connectedCallback();
    this.process();
  }

  private process() {
    const rgba = this.hexToRgba(this.color, this.opacity);
    this.outputText = `box-shadow: ${this.offsetX}px ${this.offsetY}px ${this.blurRadius}px ${this.spreadRadius}px ${rgba};`;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // eslint-disable-next-line max-lines-per-function
  override render() {
    return html`
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-2">Offset X:</label>
            <input
              type="number"
              class="form-input w-full"
              .value=${String(this.offsetX)}
              @input=${(e: Event) => {
                this.offsetX = Number((e.target as HTMLInputElement).value);
                this.process();
              }}
            />
          </div>
          <div>
            <label class="block mb-2">Offset Y:</label>
            <input
              type="number"
              class="form-input w-full"
              .value=${String(this.offsetY)}
              @input=${(e: Event) => {
                this.offsetY = Number((e.target as HTMLInputElement).value);
                this.process();
              }}
            />
          </div>
          <div>
            <label class="block mb-2">Blur Radius:</label>
            <input
              type="number"
              class="form-input w-full"
              .value=${String(this.blurRadius)}
              @input=${(e: Event) => {
                this.blurRadius = Number((e.target as HTMLInputElement).value);
                this.process();
              }}
            />
          </div>
          <div>
            <label class="block mb-2">Spread Radius:</label>
            <input
              type="number"
              class="form-input w-full"
              .value=${String(this.spreadRadius)}
              @input=${(e: Event) => {
                this.spreadRadius = Number(
                  (e.target as HTMLInputElement).value
                );
                this.process();
              }}
            />
          </div>
          <div>
            <label class="block mb-2">Color:</label>
            <input
              type="color"
              class="form-input w-full"
              .value=${this.color}
              @input=${(e: Event) => {
                this.color = (e.target as HTMLInputElement).value;
                this.process();
              }}
            />
          </div>
          <div>
            <label class="block mb-2">Opacity:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="w-full"
              .value=${String(this.opacity)}
              @input=${(e: Event) => {
                this.opacity = Number((e.target as HTMLInputElement).value);
                this.process();
              }}
            />
            <span class="text-sm">${this.opacity}</span>
          </div>
        </div>
        <div>
          <label class="block mb-2 font-semibold">CSS Output:</label>
          <textarea
            class="form-textarea w-full h-20 font-mono"
            readonly
            .value=${this.outputText}
          ></textarea>
          <t-copy-button
            .text=${this.outputText}
            .isIcon=${false}
          ></t-copy-button>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Preview:</label>
          <div class="w-32 h-32 bg-white" style="${this.outputText}"></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'css-box-shadow-generator': CssBoxShadowGenerator;
  }
}
