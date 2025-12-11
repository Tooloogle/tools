import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import cssTextShadowGeneratorStyles from "./css-text-shadow-generator.css.js";
import { customElement, property } from "lit/decorators.js";
import "../t-copy-button";
import '../t-input';
import '../t-textarea';
@customElement("css-text-shadow-generator")
export class CssTextShadowGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    cssTextShadowGeneratorStyles];

  @property({ type: Number }) offsetX = 2;
  @property({ type: Number }) offsetY = 2;
  @property({ type: Number }) blurRadius = 4;
  @property({ type: String }) color = "#000000";
  @property({ type: String }) outputText = "";

  connectedCallback() {
    super.connectedCallback();
    this.process();
  }

  private process() {
    this.outputText = `text-shadow: ${this.offsetX}px ${this.offsetY}px ${this.blurRadius}px ${this.color};`;
  }

  private renderNumberInput(
    label: string,
    value: number,
    property: "offsetX" | "offsetY" | "blurRadius",
    min?: number
  ) {
    return html`
      <div>
        <label class="block mb-2">${label}:</label>
        <t-input type="number" class="w-full"></t-input> {
            this[property] = Number(e.detail.value);
            this.process();
          }}
        />
      </div>
    `;
  }

  private renderColorInput() {
    return html`
      <div>
        <label class="block mb-2">Color:</label>
        <t-input type="color" class="w-full"></t-input> {
            this.color = e.detail.value;
            this.process();
          }}
        />
      </div>
    `;
  }

  private renderInputControls() {
    return html`
      <div class="grid grid-cols-2 gap-4">
        ${this.renderNumberInput("Offset X", this.offsetX, "offsetX")}
        ${this.renderNumberInput("Offset Y", this.offsetY, "offsetY")}
        ${this.renderNumberInput(
          "Blur Radius",
          this.blurRadius,
          "blurRadius",
          0
        )}
        ${this.renderColorInput()}
      </div>
    `;
  }

  private renderCSSOutput() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">CSS Output:</label>
        <t-textarea ?readonly=${true} class="w-full h-20 font-mono"></t-textarea>
        <t-copy-button
          .text=${this.outputText}
          .isIcon=${false}
        ></t-copy-button>
      </div>
    `;
  }

  private renderPreview() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Preview:</label>
        <div class="text-4xl font-bold" style="${this.outputText}">
          Sample Text
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderInputControls()} ${this.renderCSSOutput()}
        ${this.renderPreview()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "css-text-shadow-generator": CssTextShadowGenerator;
  }
}
