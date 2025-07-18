import { html, customElement, property } from 'lit-element'
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import convertJpgToWebpStyles from './convert-jpg-to-webp.css.js';

@customElement('convert-jpg-to-webp')
export class ConvertJpgToWebp extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, convertJpgToWebpStyles];

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
            const fileName = this.file.name.replace(/\.[^/.]+$/, '.webp');
            a.download = fileName;
            a.click();
          }
        }, 'image/webp');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

    override render() {
    return html`
      <div class="container">
        <label>Select a JPG file:</label>
        <input type="file" accept="image/jpeg,image/jpg" class="form-input" @change="${this.handleFileChange}" />
        <button class="btn" @click="${this.convert}" ?disabled="${!this.file}">
          Convert to WebP
        </button>
      </div>
    `;
  }
}

declare global {
    interface HTMLElementTagNameMap {
        'convert-jpg-to-webp': ConvertJpgToWebp;
    }
}