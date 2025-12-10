import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import heifToJpgConverterStyles from './heif-to-jpg-converter.css.js';
import { customElement, state } from 'lit/decorators.js';
import { downloadImage, isBrowser } from '../_utils/DomUtils.js';
import '../t-button';
import '../t-input';

@customElement('heif-to-jpg-converter')
export class HeifToJpgConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    heifToJpgConverterStyles];

  @state() file: File | null = null;
  @state() converting = false;
  @state() error = '';

  private handleFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    const acceptedMimeTypes = [
      'image/heif',
      'image/heic',
      'image/heif-sequence',
      'image/heic-sequence'];

    if (
      file &&
      !file.name.match(/\.(heif|heic)$/i) &&
      !acceptedMimeTypes.includes(file.type)
    ) {
      this.error = 'Only HEIF or HEIC files are supported';
      this.file = null;
      return;
    }

    this.file = file;
    this.error = '';
  }

  private async convert(): Promise<void> {
    if (!this.file) {
        return;
    }

    if (!isBrowser()) {
      this.error = 'Conversion is only supported in the browser environment.';
      return;
    }

    this.converting = true;
    this.error = '';

    try {
      // @ts-ignore - Dynamic import for SSR compatibility
      const heic2any = (await import('heic2any')).default;

      const result = await heic2any({
        blob: this.file,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      const blob = Array.isArray(result) ? result[0] : result;

      const url = URL.createObjectURL(blob);
      downloadImage(this.getConvertedFilename(), url);
    } catch (err) {
      this.error =
        err instanceof Error
          ? err.message
          : 'Conversion failed. Please try another file.';
      console.error('Conversion error:', err);
    } finally {
      this.converting = false;
    }
  }

  private getConvertedFilename(): string {
    if (!this.file) {
        return 'converted.jpg';
    }

    return this.file.name.replace(/\.(heif|heic)$/i, '.jpg');
  }

  override render() {
    return html`
      <div class="space-y-3">
        <label>Select HEIF or HEIC file:</label>
        <t-input type="file" @t-change=${this.handleFileChange}></t-input>

        ${this.error
          ? html`<div class="text-rose-500">${this.error}</div>`
          : ''}

        <t-button variant="blue" @click=${this.convert} ?disabled=${!this.file || this.converting}>
          ${this.converting ? 'Converting...' : 'Convert to JPG'}
        </t-button>

        <ul class="list-disc pl-5 text-sm">
          <li>Supports both HEIF and HEIC images (iPhone, iPad, etc.)</li>
          <li>100% browser-based — no server upload</li>
          <li>Preserves image quality (90%)</li>
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'heif-to-jpg-converter': HeifToJpgConverter;
  }
}
