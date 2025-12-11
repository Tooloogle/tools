import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import passportPhotoMakerStyles from './passport-photo-maker.css.js';
import { customElement, state } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { downloadImage, isBrowser } from '../_utils/DomUtils.js';

interface PhotoSize {
  name: string;
  widthMM: number;
  heightMM: number;
  widthInch: number;
  heightInch: number;
  dpi: number;
}

const PHOTO_SIZES: PhotoSize[] = [
  { name: 'US Passport (2x2")', widthMM: 51, heightMM: 51, widthInch: 2, heightInch: 2, dpi: 300 },
  { name: 'UK/EU/India (35x45mm)', widthMM: 35, heightMM: 45, widthInch: 1.38, heightInch: 1.77, dpi: 300 },
  { name: 'China (33x48mm)', widthMM: 33, heightMM: 48, widthInch: 1.30, heightInch: 1.89, dpi: 300 },
  { name: 'Canada (50x70mm)', widthMM: 50, heightMM: 70, widthInch: 1.97, heightInch: 2.76, dpi: 300 },
];

@customElement('passport-photo-maker')
export class PassportPhotoMaker extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    buttonStyles,
    passportPhotoMakerStyles,
  ];

  @state() private selectedFile: File | null = null;
  @state() private imageUrl = '';
  @state() private selectedSize: PhotoSize = PHOTO_SIZES[0];
  @state() private error = '';
  @state() private processing = false;
  @state() private outputImageUrl = '';

  private imageElement: HTMLImageElement | null = null;

  private get sizeOptions() {
    return PHOTO_SIZES.map(
      (size, index) =>
        html`<option value="${index}">${size.name} - ${size.widthMM}x${size.heightMM}mm</option>`
    );
  }

  private handleFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)) {
      this.error = 'Please upload a valid image file (JPG, PNG, WEBP, HEIC)';
      return;
    }

    this.selectedFile = file;
    this.error = '';
    this.outputImageUrl = '';

    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }

    this.imageUrl = URL.createObjectURL(file);
  }

  private handleSizeChange(e: Event): void {
    this.selectedSize = PHOTO_SIZES[parseInt((e.target as HTMLSelectElement).value)];
    this.outputImageUrl = '';
  }

  private async processImage(): Promise<void> {
    if (!this.selectedFile || !this.imageUrl) {
      this.error = 'Please select an image first';
      return;
    }

    if (!isBrowser()) {
      this.error = 'Image processing is only supported in browser environment';
      return;
    }

    this.processing = true;
    this.error = '';
    try {
      const imageUrl = await this.prepareImageUrl();
      await this.loadImage(imageUrl);
      if (!this.imageElement) {
        throw new Error('Failed to load image');
      }

      const canvas = this.createPassportPhotoCanvas();
      this.outputImageUrl = canvas.toDataURL('image/jpeg', 0.95);
      this.error = '';
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to process image';
      console.error('Image processing error:', err);
    } finally {
      this.processing = false;
    }
  }

  private async prepareImageUrl(): Promise<string> {
    if (!this.selectedFile) {
      return this.imageUrl;
    }

    const isHeicFile =
      this.selectedFile.type.includes('heic') ||
      this.selectedFile.type.includes('heif') ||
      Boolean(this.selectedFile.name.match(/\.(heic|heif)$/i));
    if (!isHeicFile) {
      return this.imageUrl;
    }

    try {
      // @ts-expect-error - heic2any has no TypeScript declarations, dynamic import for SSR compatibility
      const heic2any = (await import('heic2any')).default;
      const result = await heic2any({
        blob: this.selectedFile,
        toType: 'image/jpeg',
        quality: 1,
      });
      const blob = Array.isArray(result) ? result[0] : result;
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('HEIC conversion error:', err);
      throw new Error('Failed to convert HEIC image. Please use JPG or PNG format.');
    }
  }

  private createPassportPhotoCanvas(): HTMLCanvasElement {
    const mmToInch = 0.0393701;
    const targetWidthPx = Math.round(this.selectedSize.widthMM * mmToInch * this.selectedSize.dpi);
    const targetHeightPx = Math.round(this.selectedSize.heightMM * mmToInch * this.selectedSize.dpi);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidthPx;
    canvas.height = targetHeightPx;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const cropParams = this.calculateCropParameters(targetWidthPx, targetHeightPx);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);
    if (this.imageElement) {
      ctx.drawImage(
        this.imageElement,
        cropParams.sourceX,
        cropParams.sourceY,
        cropParams.sourceWidth,
        cropParams.sourceHeight,
        0,
        0,
        targetWidthPx,
        targetHeightPx
      );
    }

    return canvas;
  }

  private calculateCropParameters(targetWidthPx: number, targetHeightPx: number) {
    if (!this.imageElement) {
      return { sourceX: 0, sourceY: 0, sourceWidth: 0, sourceHeight: 0 };
    }

    const imgWidth = this.imageElement.naturalWidth;
    const imgHeight = this.imageElement.naturalHeight;
    const targetRatio = targetWidthPx / targetHeightPx;
    const imgRatio = imgWidth / imgHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = imgWidth;
    let sourceHeight = imgHeight;
    if (imgRatio > targetRatio) {
      sourceWidth = imgHeight * targetRatio;
      sourceX = (imgWidth - sourceWidth) / 2;
    } else {
      sourceHeight = imgWidth / targetRatio;
      sourceY = (imgHeight - sourceHeight) / 2;
    }

    return { sourceX, sourceY, sourceWidth, sourceHeight };
  }

  private loadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageElement = img;
        resolve();
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  private download(): void {
    if (!this.outputImageUrl) {
      return;
    }

    const filename = `passport-photo-${this.selectedSize.widthMM}x${this.selectedSize.heightMM}mm.jpg`;

    downloadImage(filename, this.outputImageUrl);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }

  override render() {
    const { widthMM, heightMM, widthInch, heightInch, dpi } = this.selectedSize;

    return html`
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="block font-medium">Select Photo:</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
            class="form-input w-full"
            @change=${this.handleFileChange}
          />
          <p class="text-sm text-gray-600">Supported: JPG, PNG, WEBP, HEIC</p>
        </div>
        <div class="space-y-2">
          <label class="block font-medium">Passport Size:</label>
          <select class="form-input w-full" @change=${this.handleSizeChange}>${this.sizeOptions}</select>
        </div>
        ${this.error ? html`<div class="text-rose-500 p-3 bg-rose-50 rounded">${this.error}</div>` : ''}
        <button class="btn btn-blue w-full" @click=${this.processImage} ?disabled=${!this.selectedFile || this.processing}>
          ${this.processing ? 'Processing...' : 'Generate Passport Photo'}
        </button>
        ${this.imageUrl && !this.outputImageUrl
          ? html`<div class="space-y-2">
              <h3 class="font-medium">Original:</h3>
              <div class="border rounded p-2 bg-gray-50">
                <img src="${this.imageUrl}" alt="Original" class="max-w-full h-auto max-h-96 mx-auto" />
              </div>
            </div>`
          : ''}
        ${this.outputImageUrl
          ? html`<div class="space-y-3">
              <h3 class="font-medium">Passport Photo:</h3>
              <div class="border rounded p-4 bg-gray-50">
                <img src="${this.outputImageUrl}" alt="Passport Photo" class="mx-auto border-2 border-gray-300" style="max-width: 400px;" />
              </div>
              <div class="bg-blue-50 p-3 rounded text-sm">
                <p><strong>Dimensions:</strong> ${widthMM}x${heightMM}mm (${widthInch}x${heightInch}")</p>
                <p><strong>Resolution:</strong> ${dpi} DPI</p>
              </div>
              <button class="btn btn-green w-full" @click=${this.download}>Download</button>
            </div>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'passport-photo-maker': PassportPhotoMaker;
  }
}
