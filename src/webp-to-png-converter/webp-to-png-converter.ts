import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { WebComponentBase } from "../_web-component/WebComponentBase.js";
import webpToPngConverterStyles from "./webp-to-png-converter.css.js";
import "../t-file-dropzone/index.js";
import type { TFileDropzoneChangeDetail } from "../t-file-dropzone/t-file-dropzone.js";

@customElement("webp-to-png-converter")
export class WebpToPngConverter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    webpToPngConverterStyles];

  @property({ type: Object }) file: File | null = null;

  private handleFileChange(e: CustomEvent<TFileDropzoneChangeDetail>) {
    this.file = e.detail.file;
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
        <t-file-dropzone
          accept="image/webp,.webp"
          label="Drop a WebP file here or click to browse"
          @change=${this.handleFileChange}
        ></t-file-dropzone>
        <button
          class="btn btn-blue"
          @click="${this.convert}"
          ?disabled="${!this.file}"
        >
          Convert to PNG
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webp-to-png-converter": WebpToPngConverter;
  }
}
