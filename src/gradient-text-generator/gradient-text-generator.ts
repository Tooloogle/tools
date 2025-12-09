import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import gradientTextGeneratorStyles from './gradient-text-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-input/t-input.js';

@customElement('gradient-text-generator')
export class GradientTextGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    gradientTextGeneratorStyles];

  @property({ type: String }) inputText = 'Gradient Text';
  @property({ type: String }) color1 = '#ff0000';
  @property({ type: String }) color2 = '#0000ff';
  @property({ type: String }) gradientType = 'linear';
  @property({ type: Number }) angle = 90;

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
  }

  private handleColor1Change(e: CustomEvent) {
    this.color1 = e.detail.value;
  }

  private handleColor2Change(e: CustomEvent) {
    this.color2 = e.detail.value;
  }

  private handleGradientTypeChange(e: CustomEvent) {
    this.gradientType = e.detail.value;
  }

  private handleAngleChange(e: CustomEvent) {
    this.angle = Number(e.detail.value);
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
          <t-input placeholder="Enter text..." class="w-full"></t-input>
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
              <t-input></t-input>
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
              <t-input></t-input>
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
          <t-textarea ?readonly=${true} class="w-full h-40 font-mono text-sm"></t-textarea>
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
