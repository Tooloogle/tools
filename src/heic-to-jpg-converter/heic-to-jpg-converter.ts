import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import heicToJpgConverterStyles from './heic-to-jpg-converter.css.js';
import { customElement, state } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import heic2any from 'heic2any';

@customElement('heic-to-jpg-converter')
export class HeicToJpgConverter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    buttonStyles,
    heicToJpgConverterStyles,
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
      !file.name.match(/\.heif$/i) &&
      !file.name.match(/\.heic$/i) &&
      !acceptedMimeTypes.includes(file.type)
    ) {
      this.error = 'Only HEIC files are supported';
      this.file = null;
      return;
    }

    this.file = file;
    this.error = '';
  }

  private async convert(): Promise<void> {
    if (!this.file) return;

    this.converting = true;
    this.error = '';

    try {
      const result = await heic2any({
        blob: this.file,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      const blob = Array.isArray(result) ? result[0] : result;
      this.downloadImage(blob);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Conversion failed';
      console.error('Conversion error:', err);
    } finally {
      this.converting = false;
    }
  }

  private downloadImage(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getConvertedFilename();
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  private getConvertedFilename(): string {
    if (!this.file) return 'converted.jpg';
    return this.file.name.replace(/\.heic$/i, '.jpg');
  }

  override render() {
    return html`
      <div class="space-y-3">
        <label>Select HEIC file:</label>
        <input
          type="file"
          accept=".heic,image/heic"
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
          ${this.converting ? 'Converting...' : 'Convert to JPG'}
        </button>

        <ul class="list-disc pl-5 text-sm">
          <li>Works with HEIC files (iPhone, iPad, etc.)</li>
          <li>100% browser-based - no server upload</li>
          <li>Preserves image quality</li>
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'heic-to-jpg-converter': HeicToJpgConverter;
  }
}
