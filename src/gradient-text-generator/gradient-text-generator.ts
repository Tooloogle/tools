import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import gradientTextGeneratorStyles from './gradient-text-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';

@customElement('gradient-text-generator')
export class GradientTextGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    gradientTextGeneratorStyles,
  ];

  @property({ type: String }) inputText = 'Gradient Text';
  @property({ type: String }) color1 = '#ff0000';
  @property({ type: String }) color2 = '#0000ff';
  @property({ type: String }) gradientType = 'linear';
  @property({ type: Number }) angle = 90;

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLInputElement).value;
  }

  private handleColor1Change(e: Event) {
    this.color1 = (e.target as HTMLInputElement).value;
  }

  private handleColor2Change(e: Event) {
    this.color2 = (e.target as HTMLInputElement).value;
  }

  private handleGradientTypeChange(e: Event) {
    this.gradientType = (e.target as HTMLSelectElement).value;
  }

  private handleAngleChange(e: Event) {
    this.angle = Number((e.target as HTMLInputElement).value);
  }

  private getGradientStyle(): string {
    if (this.gradientType === 'linear') {
      return `linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2})`;
    }

    return `radial-gradient(circle, ${this.color1}, ${this.color2})`;
  }

  private generateGradientCSS(): string {
    const gradient = this.getGradientStyle();

    return `.gradient-text {
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 48px;
  font-weight: bold;
}`;
  }

  // eslint-disable-next-line max-lines-per-function
  override render() {
    const cssCode = this.generateGradientCSS();
    const gradientStyle = this.getGradientStyle();

    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Text:</label>
          <input
            type="text"
            class="form-input w-full"
            placeholder="Enter text..."
            .value=${this.inputText}
            @input=${this.handleInput}
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 font-semibold">Color 1:</label>
            <div class="flex gap-2">
              <input
                type="color"
                .value=${this.color1}
                @input=${this.handleColor1Change}
                class="h-10 w-16"
              />
              <input
                type="text"
                class="form-input"
                .value=${this.color1}
                @input=${this.handleColor1Change}
              />
            </div>
          </div>
          <div>
            <label class="block mb-2 font-semibold">Color 2:</label>
            <div class="flex gap-2">
              <input
                type="color"
                .value=${this.color2}
                @input=${this.handleColor2Change}
                class="h-10 w-16"
              />
              <input
                type="text"
                class="form-input"
                .value=${this.color2}
                @input=${this.handleColor2Change}
              />
            </div>
          </div>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Gradient Type:</label>
          <select
            class="form-select w-full"
            .value=${this.gradientType}
            @change=${this.handleGradientTypeChange}
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>
        ${this.gradientType === 'linear'
          ? html`
              <div>
                <label class="block mb-2 font-semibold"
                  >Angle: ${this.angle}°</label
                >
                <input
                  type="range"
                  min="0"
                  max="360"
                  class="w-full"
                  .value=${String(this.angle)}
                  @input=${this.handleAngleChange}
                />
              </div>
            `
          : ''}
        <div class="p-4 bg-white border rounded text-center">
          <p class="font-bold mb-2">Preview:</p>
          <div
            style="background: ${gradientStyle}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 48px; font-weight: bold;"
          >
            ${this.inputText}
          </div>
        </div>
        <div>
          <label class="block mb-2 font-semibold">CSS Code:</label>
          <textarea
            class="form-textarea w-full h-40 font-mono text-sm"
            readonly
            .value=${cssCode}
          ></textarea>
          <t-copy-button .text=${cssCode} .isIcon=${false}></t-copy-button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gradient-text-generator': GradientTextGenerator;
  }
}
