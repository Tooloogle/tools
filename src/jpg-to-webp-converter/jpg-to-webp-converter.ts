import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import jpgToWebpConverterStyles from "./jpg-to-webp-converter.css.js";
import '../t-button';
import '../t-input';

@customElement("jpg-to-webp-converter")
export class JpgToWebpConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    jpgToWebpConverterStyles];

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

            const fileName = this.file.name.replace(/\.[^/.]+$/, ".webp");
            a.download = fileName;
            a.click();
          }
        }, "image/webp");
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(this.file);
  }

  override render() {
    return html`
      <div class="space-y-3">
        <label>Select a JPG file:</label>
        <t-input type="file" @t-change="${this.handleFileChange}"></t-input>
        <t-button variant="blue" @click="${this.convert}" ?disabled="${!this.file}">
          Convert to WebP
        </t-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jpg-to-webp-converter": JpgToWebpConverter;
  }
}
