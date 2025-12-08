import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import cssBorderRadiusGeneratorStyles from "./css-border-radius-generator.css.js";
import { customElement, property } from "lit/decorators.js";
import inputStyles from "../_styles/input.css.js";
import "../t-copy-button";

@customElement("css-border-radius-generator")
export class CssBorderRadiusGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    cssBorderRadiusGeneratorStyles,
  ];

  @property({ type: Number }) topLeft = 0;
  @property({ type: Number }) topRight = 0;
  @property({ type: Number }) bottomRight = 0;
  @property({ type: Number }) bottomLeft = 0;
  @property({ type: String }) outputText = "";

  connectedCallback() {
    super.connectedCallback();
    this.process();
  }

  private process() {
    if (
      this.topLeft === this.topRight &&
      this.topRight === this.bottomRight &&
      this.bottomRight === this.bottomLeft
    ) {
      this.outputText = `border-radius: ${this.topLeft}px;`;
    } else {
      this.outputText = `border-radius: ${this.topLeft}px ${this.topRight}px ${this.bottomRight}px ${this.bottomLeft}px;`;
    }
  }

  private renderCornerInput(
    label: string,
    value: number,
    property: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  ) {
    return html`
      <div>
        <label class="block mb-2">${label}:</label>
        <input
          type="number"
          min="0"
          class="form-input w-full"
          .value=${String(value)}
          @input=${(e: Event) => {
            this[property] = Number((e.target as HTMLInputElement).value);
            this.process();
          }}
        />
      </div>
    `;
  }

  private renderCornerInputs() {
    return html`
      <div class="grid grid-cols-2 gap-4">
        ${this.renderCornerInput("Top Left", this.topLeft, "topLeft")}
        ${this.renderCornerInput("Top Right", this.topRight, "topRight")}
        ${this.renderCornerInput("Bottom Left", this.bottomLeft, "bottomLeft")}
        ${this.renderCornerInput(
          "Bottom Right",
          this.bottomRight,
          "bottomRight"
        )}
      </div>
    `;
  }

  private renderCSSOutput() {
    return html`
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
    `;
  }

  private renderPreview() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Preview:</label>
        <div class="w-32 h-32 bg-blue-500" style="${this.outputText}"></div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderCornerInputs()} ${this.renderCSSOutput()}
        ${this.renderPreview()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "css-border-radius-generator": CssBorderRadiusGenerator;
  }
}
