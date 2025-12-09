import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import webpToPngConverterStyles from "./webp-to-png-converter.css.js";
import '../t-button';
import '../t-input';

@customElement("webp-to-png-converter")
export class WebpToPngConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    webpToPngConverterStyles];

  @property({ type: Object }) file: File | null = null;

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  private convert() {
    if (!this.file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(blob => {
          if (blob) {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            if (!this.file) {
                return;
            }

            const fileName = this.file.name.replace(/\.[^/.]+$/, ".png");
            a.download = fileName;
            a.click();
          }
        }, "image/png");
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(this.file);
  }

  override render() {
    return html`
      <div class="space-y-3">
        <label>Select a WebP file:</label>
        <t-input type="file" @t-change="${this.handleFileChange}"></t-input>
        <t-button variant="blue" ?disabled=${!this.file}>
          Convert to PNG
        </t-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webp-to-png-converter": WebpToPngConverter;
  }
}
