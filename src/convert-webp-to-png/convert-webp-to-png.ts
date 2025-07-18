import { html, customElement, property } from 'lit-element'
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import convertWebpToPngStyles from './convert-webp-to-png.css.js';

@customElement('convert-webp-to-png')
export class ConvertWebpToPng extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, convertWebpToPngStyles];

    @property({ type: Object }) file: File | null = null;

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files?.[0] ?? null;
  }

  private convert() {
    if (!this.file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            if (!this.file) return;
            const fileName = this.file.name.replace(/\.[^/.]+$/, '.png');
            a.download = fileName;
            a.click();
          }
        }, 'image/png');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

    override render() {
    return html`
      <div class="container">
        <label>Select a WebP file:</label>
        <input type="file" accept="image/webp" class="form-input" @change="${this.handleFileChange}" />
        <button class="btn" @click="${this.convert}" ?disabled="${!this.file}">
          Convert to PNG
        </button>
      </div>
    `;
  }
}

declare global {
    interface HTMLElementTagNameMap {
        'convert-webp-to-png': ConvertWebpToPng;
    }
}