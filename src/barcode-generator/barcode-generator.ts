import { html } from "lit";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import barcodeGeneratorStyles from "./barcode-generator.css.js";
import { customElement, property } from "lit/decorators.js";
import { isCanvasSupported, downloadImage } from "../_utils/DomUtils.js";
import JsBarcode from "jsbarcode";
import "../t-input";
import "../t-button";
import "../t-select";

interface FormatValidation {
  regex: RegExp;
  length?: number;
  message: string;
}

@customElement("barcode-generator")
export class BarcodeGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, barcodeGeneratorStyles];

  @property({ type: String }) inputText = "123456789012";
  @property({ type: String }) format = "CODE128";
  @property({ type: String }) error = "";
  @property({ type: Boolean }) barcodeGenerated = false;

  private formatValidations: Record<string, FormatValidation> = {
    CODE128: {
      // eslint-disable-next-line no-control-regex
      regex: /^[\x00-\x7F]+$/,
      message: "CODE128 accepts ASCII characters",
    },
    EAN13: {
      regex: /^\d{12,13}$/,
      length: 13,
      message: "EAN-13 requires exactly 12 or 13 digits",
    },
    EAN8: {
      regex: /^\d{7,8}$/,
      length: 8,
      message: "EAN-8 requires exactly 7 or 8 digits",
    },
    UPC: {
      regex: /^\d{11,12}$/,
      length: 12,
      message: "UPC requires exactly 11 or 12 digits",
    },
    CODE39: {
      // eslint-disable-next-line no-useless-escape
      regex: /^[0-9A-Z\-\.\ \$\/\+\%]+$/,
      message: "CODE39 accepts 0-9, A-Z, and special chars (-.$/+%)",
    },
  };

  private formatOptions = [
    { value: "CODE128", label: "CODE128 (Alphanumeric)" },
    { value: "EAN13", label: "EAN-13 (13 digits)" },
    { value: "EAN8", label: "EAN-8 (8 digits)" },
    { value: "UPC", label: "UPC (12 digits)" },
    { value: "CODE39", label: "CODE39 (A-Z, 0-9)" },
  ];

  private validateInput(): boolean {
    const validation = this.formatValidations[this.format];
    if (!validation) {
      return true;
    }

    if (!this.inputText.trim()) {
      this.error = "Please enter text for the barcode";
      return false;
    }

    if (!validation.regex.test(this.inputText)) {
      this.error = validation.message;
      return false;
    }

    return true;
  }

  private generateBarcode() {
    this.error = "";
    this.barcodeGenerated = false;

    if (!isCanvasSupported()) {
      this.error = "Canvas is not supported in this browser";
      return;
    }

    const canvas = this.shadowRoot?.querySelector(
      "#barcode"
    ) as HTMLCanvasElement;

    if (!canvas) {
      this.error = "Canvas element not found";
      return;
    }

    if (!this.validateInput()) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    try {
      JsBarcode(canvas, this.inputText, {
        format: this.format,
        displayValue: true,
        fontSize: 14,
        height: 100,
      });
      this.barcodeGenerated = true;
    } catch (err) {
      this.error = `Error: ${(err as Error).message}`;
      this.barcodeGenerated = false;
    }
  }

  private handleGenerate() {
    this.generateBarcode();
  }

  private handleDownload() {
    if (!this.barcodeGenerated) {
      this.error = "Please generate a barcode first";
      return;
    }

    const canvas = this.shadowRoot?.querySelector(
      "#barcode"
    ) as HTMLCanvasElement;

    if (!canvas) {
      this.error = "Canvas element not found";
      return;
    }

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const filename = `barcode-${this.format}-${Date.now()}.png`;
      downloadImage(filename, dataUrl);
    } catch (err) {
      this.error = `Download error: ${(err as Error).message}`;
    }
  }

  private handleInputChange(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.barcodeGenerated = false;
  }

  private handleFormatChange(e: CustomEvent) {
    this.format = e.detail.value;
    this.barcodeGenerated = false;
    this.error = "";

    const defaults: Record<string, string> = {
      CODE128: "123456789012",
      EAN13: "5901234123457",
      EAN8: "96385074",
      UPC: "012345678905",
      CODE39: "CODE39",
    };

    this.inputText = defaults[this.format] || this.inputText;
  }

  private renderErrorSection() {
    if (!this.error) {
      return "";
    }

    return html`
      <div
        class="text-red-600 text-sm font-medium bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded"
      >
        ${this.error}
      </div>
    `;
  }

  private renderInputSection() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Barcode Text:</label>
        <t-input
          type="text"
          class="form-input w-full"
          placeholder="Enter text or number..."
          .value=${this.inputText}
          @t-input=${this.handleInputChange}
        ></t-input>
        <p class="text-xs text-gray-500 dark:text-gray-300 mt-1">
          ${this.formatValidations[this.format]?.message || ""}
        </p>
      </div>
    `;
  }

  private renderFormatSection() {
    return html`
      <div>
        <label class="block mb-2 font-semibold">Format:</label>
        <t-select
          .value=${this.format}
          .options=${this.formatOptions}
          @t-select=${this.handleFormatChange}
        ></t-select>
      </div>
    `;
  }

  private renderButtonSection() {
    return html`
      <div class="flex items-center justify-between gap-2">
        <t-button variant="blue" @click=${this.handleGenerate}>
          Generate Barcode
        </t-button>
        <t-button
          variant="green"
          ?disabled=${!this.barcodeGenerated}
          @click=${this.handleDownload}
        >
          Download
        </t-button>
      </div>
    `;
  }

  private renderBarcodeCanvas() {
    return html`
      <div
        class="flex justify-center p-4 rounded border border-solid border-gray-300 dark:border-gray-500 min-h-[150px] items-center"
      >
        <canvas id="barcode"></canvas>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderInputSection()} ${this.renderFormatSection()}
        ${this.renderErrorSection()} ${this.renderButtonSection()}
        ${this.renderBarcodeCanvas()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "barcode-generator": BarcodeGenerator;
  }
}
