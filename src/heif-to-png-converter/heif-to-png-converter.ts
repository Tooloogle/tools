import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import heifToPngConverterStyles from './heif-to-png-converter.css.js';
import { customElement, state } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { downloadImage, isBrowser } from '../_utils/DomUtils.js';

@customElement('heif-to-png-converter')
export class HeifToPngConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    buttonStyles,
    heifToPngConverterStyles,
  ];

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
      'image/heic-sequence',
    ];

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
    if (!this.file) return;
    if (!isBrowser()) {
      this.error = 'Conversion is only supported in the browser environment.';
      return;
    }

    this.converting = true;
    this.error = '';

    try {
      // @ts-expect-error - dynamic import for SSR compatibility
      const heic2any = (await import('heic2any')).default;

      const result = await heic2any({
        blob: this.file,
        toType: 'image/png',
        quality: 1.0,
      });

      const blob = Array.isArray(result) ? result[0] : result;
      const url = URL.createObjectURL(blob);

      downloadImage(this.getConvertedFilename(), url);
      URL.revokeObjectURL(url);
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
    if (!this.file) return 'converted.png';
    return this.file.name.replace(/\.(heif|heic)$/i, '.png');
  }

  override render() {
    return html`
      <div class="space-y-3">
        <label>Select HEIF or HEIC file:</label>
        <input
          type="file"
          accept=".heif,.heic,image/heif,image/heic"
          class="form-input"
          @change=${this.handleFileChange}
        />

        ${this.error
          ? html`<div class="text-rose-500">${this.error}</div>`
          : ''}

        <button
          class="btn btn-blue"
          @click=${this.convert}
          ?disabled=${!this.file || this.converting}
        >
          ${this.converting ? 'Converting...' : 'Convert to PNG'}
        </button>

        <ul class="list-disc pl-5 text-sm">
          <li>Supports both HEIF and HEIC files (iPhone, iPad, etc.)</li>
          <li>Preserves transparency in PNG output</li>
          <li>100% browser-based — no server upload</li>
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'heif-to-png-converter': HeifToPngConverter;
  }
}
