import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import base64UrlSafeEncoderStyles from "./base64-url-safe-encoder.css.js";
import { customElement, property } from "lit/decorators.js";
import "../t-copy-button";
import '../t-button';
import '../t-textarea';

@customElement("base64-url-safe-encoder")
export class Base64UrlSafeEncoder extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    base64UrlSafeEncoderStyles];

  @property()
  input = "";

  @property()
  output = "";

  @property()
  mode: "encode" | "decode" = "encode";

  @property()
  error = "";

  private handleInputChange(e: CustomEvent) {
    this.input = e.detail.value;
    this.error = "";
  }

  private encode() {
    this.mode = "encode";
    this.error = "";
    try {
      const base64 = btoa(this.input);
      this.output = base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    } catch (e) {
      this.error = `Error encoding: ${(e as Error).message}`;
      this.output = "";
    }
  }

  private decode() {
    this.mode = "decode";
    this.error = "";
    try {
      let base64 = this.input.replace(/-/g, "+").replace(/_/g, "/");

      const padding = base64.length % 4;
      if (padding) {
        base64 += "=".repeat(4 - padding);
      }

      this.output = atob(base64);
    } catch (e) {
      this.error = `Error decoding: ${(e as Error).message}`;
      this.output = "";
    }
  }

  private clear() {
    this.input = "";
    this.output = "";
    this.error = "";
  }

  private renderInputSection() {
    return html`
      <label class="block py-1">
        <span class="inline-block py-1 font-bold">Input:</span>
        <t-textarea placeholder="Enter text to encode or Base64 URL-safe string to decode..." rows="6" .value=${String(this.input)} @t-input=${this.handleInputChange}></t-textarea>
      </label>
    `;
  }

  private renderActionButtons() {
    return html`
      <div class="py-2 flex flex-wrap gap-2">
        <t-button variant="blue" @click=${this.encode} ?disabled=${!this.input}>
          Encode
        </t-button>
        <t-button variant="blue" @click=${this.decode} ?disabled=${!this.input}>
          Decode
        </t-button>
        <t-button variant="red" @click=${this.clear} ?disabled=${!this.input}>
          Clear
        </t-button>
      </div>
    `;
  }

  private renderError() {
    if (!this.error) {
      return "";
    }

    return html`
      <div class="py-2">
        <div class="px-3 py-2 bg-red-100 text-red-800 rounded">
          ${this.error}
        </div>
      </div>
    `;
  }

  private renderOutput() {
    if (!this.output) {
      return "";
    }

    return html`
      <label class="block py-1">
        <span class="inline-block py-1 font-bold">Output:</span>
        <t-textarea rows="6" .value=${String(this.output)} ?readonly=${true}></t-textarea>
        <div class="py-2 text-right">
          <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
        </div>
      </label>
    `;
  }

  override render() {
    return html`
      ${this.renderInputSection()} ${this.renderActionButtons()}
      ${this.renderError()} ${this.renderOutput()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "base64-url-safe-encoder": Base64UrlSafeEncoder;
  }
}
