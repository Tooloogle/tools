import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import dataUriGeneratorStyles from "./data-uri-generator.css.js";
import { customElement, property } from "lit/decorators.js";
import "../t-copy-button";
import '../t-textarea';

@customElement("data-uri-generator")
export class DataUriGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    dataUriGeneratorStyles];

  @property({ type: String }) inputText = "";
  @property({ type: String }) outputText = "";
  @property({ type: String }) mimeType = "text/plain";
  @property({ type: Boolean }) useBase64 = true;

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private handleMimeTypeChange(e: CustomEvent) {
    this.mimeType = e.detail.value;
    this.process();
  }

  private handleBase64Change(e: Event) {
    this.useBase64 = (e.target as HTMLInputElement).checked;
    this.process();
  }

  private process() {
    if (!this.inputText) {
      this.outputText = "";
      return;
    }

    try {
      if (this.useBase64) {
        const base64Data = btoa(unescape(encodeURIComponent(this.inputText)));
        this.outputText = `data:${this.mimeType};base64,${base64Data}`;
      } else {
        const encodedData = encodeURIComponent(this.inputText);
        this.outputText = `data:${this.mimeType},${encodedData}`;
      }
    } catch (err) {
      this.outputText =
        "Error: Unable to encode text. Please check your input.";
      console.error(err);
    }
  }

  private renderMimeTypeSelect() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">MIME Type:</label>
        <select
          class="form-select w-full"
          .value=${this.mimeType}
          @change=${this.handleMimeTypeChange}
        >
          <option value="text/plain">text/plain</option>
          <option value="text/html">text/html</option>
          <option value="text/css">text/css</option>
          <option value="text/javascript">text/javascript</option>
          <option value="application/json">application/json</option>
          <option value="application/xml">application/xml</option>
          <option value="image/svg+xml">image/svg+xml</option>
        </select>
      </div>
    `;
  }

  private renderBase64Checkbox() {
    return html`
      <div>
        <label class="block mb-2">
          <input
            type="checkbox"
            .checked=${this.useBase64}
            @change=${this.handleBase64Change}
          />
          <span class="ml-2">Use Base64 encoding</span>
        </label>
      </div>
    `;
  }

  private renderInputTextarea() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Input Text:</label>
        <t-textarea placeholder="Enter text to convert to Data URI..." class="w-full h-32"></t-textarea>
      </div>
    `;
  }

  private renderOutputTextarea() {
    const hasValidOutput =
      this.outputText && !this.outputText.startsWith("Error:");

    return html`
      <div>
        <label class="block mb-2 font-semibold">Data URI Output:</label>
        <t-textarea ?readonly=${true} class="w-full h-32 font-mono text-sm"></t-textarea>
        ${hasValidOutput
          ? html`<t-copy-button
              .text=${this.outputText}
              .isIcon=${false}
            ></t-copy-button>`
          : ""}
      </div>
    `;
  }

  private renderHTMLPreview() {
    const shouldShowPreview =
      this.outputText &&
      !this.outputText.startsWith("Error:") &&
      this.mimeType.startsWith("text/html");

    if (!shouldShowPreview) {
      return "";
    }

    return html`
      <div class="p-4 bg-gray-100 rounded">
        <p class="font-bold mb-2">HTML Preview:</p>
        <iframe
          src="${this.outputText}"
          class="w-full h-32 border rounded bg-white"
          sandbox
        ></iframe>
      </div>
    `;
  }

  private renderInfoNote() {
    return html`
      <div class="text-sm text-gray-600">
        <p>
          <strong>Note:</strong> Data URIs allow you to embed data directly in
          HTML/CSS.
        </p>
        <p>Base64 encoding is recommended for binary or non-ASCII data.</p>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderMimeTypeSelect()} ${this.renderBase64Checkbox()}
        ${this.renderInputTextarea()} ${this.renderOutputTextarea()}
        ${this.renderHTMLPreview()} ${this.renderInfoNote()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "data-uri-generator": DataUriGenerator;
  }
}
