import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import qrCodeGeneratorStyles from './qr-code-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import inputStyles from '../_styles/input.css.js';
import { repeat } from 'lit/directives/repeat.js';
import { IQrStyleListItem, QrStyleList } from './qr-style-list.js';
import { Logo } from './logo.js';
import buttonStyles from '../_styles/button.css.js';
import { isBrowser } from '../_utils/DomUtils.js';
import QRCodeStyling, { FileExtension } from 'qr-code-styling';

/* eslint-disable max-lines */
@customElement('qr-code-generator')
export class QrCodeGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    qrCodeGeneratorStyles,
    inputStyles,
    buttonStyles,
  ];
  container: Ref<HTMLDivElement> = createRef();

  qrCode: QRCodeStyling = isBrowser()
    ? new QRCodeStyling({ ...QrStyleList[2].qrCfg, width: 300, height: 300 })
    : ({} as QRCodeStyling);

  @property() text = '';

  @property() image = Logo;

  @property() selected = 2;

  @property() width = 300;

  @property() height = 300;

  @property() margin = 5;

  @property() bgColor = '#ffffff';

  @property() dotColor = '#4267b2';
  @property() squareColor = '#4267b2';

  @property()
  downloadExt: FileExtension = 'jpeg';

  async connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.text = 'https://www.tooloogle.com/';
      this.qrCode.append(this.container.value);
      this.onTextChange();
    }, 0);
  }

  onTextChange(e?: Event) {
    if (e?.target) {
      const target = e.target as HTMLTextAreaElement;
      this.text = target?.value;
    }

    this.qrCode.update({ data: this.text, margin: this.margin });
  }

  renderQrListItem(el: HTMLSpanElement, qr: IQrStyleListItem) {
    if (!el || el.querySelector('canvas')) {
      return;
    }

    const qrCode = new QRCodeStyling({
      ...qr.qrCfg,
      image: this.image,
    });

    qrCode.append(el);
  }

  onQrListItemClick(qr: IQrStyleListItem, index: number) {
    this.selected = index;
    this.qrCode.update({
      ...qr.qrCfg,
      width: this.width,
      height: this.height,
      data: this.text,
      image: this.image,
      margin: this.margin,
    });

    this.qrCode.update({
      backgroundOptions: {
        color: this.bgColor,
      },
      dotsOptions: {
        color: this.dotColor,
      },
      cornersSquareOptions: {
        color: this.squareColor,
      },
      margin: this.margin,
    });
  }

  async onImageUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files?.length) {
      return;
    }

    this.image = await this.fileToBase64(target.files[0]);
    this.qrCode.update({ image: this.image });
  }

  async download() {
    await this.qrCode.download({
      name: 'qr-tooloogle',
      extension: this.downloadExt,
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = reject;
    });
  }

  private handleWidthChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.width = target?.value ? parseInt(target?.value) : 300;
    this.qrCode.update({ width: this.width });
  }

  private handleHeightChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.height = target?.value ? parseInt(target?.value) : 300;
    this.qrCode.update({ height: this.height });
  }

  private handleMarginChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.margin = parseInt(target?.value);
    this.qrCode.update({ margin: this.margin });
  }

  private handleBgColorChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.bgColor = target?.value || '#ffffff';
    this.qrCode.update({ backgroundOptions: { color: this.bgColor } });
  }

  private handleDotColorChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.dotColor = target?.value || '#4267b2';
    this.qrCode.update({ dotsOptions: { color: this.dotColor } });
  }

  private handleSquareColorChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.squareColor = target?.value || '#4267b2';
    this.qrCode.update({ cornersSquareOptions: { color: this.squareColor } });
  }

  private handleDownloadExtChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.downloadExt = (target?.value as FileExtension) || 'jpeg';
  }

  private removeLogo() {
    this.image = '';
    this.qrCode.update({ image: '' });
  }

  private handleQrStyleRef(el: Element | undefined, qr: IQrStyleListItem) {
    if (el) {
      this.renderQrListItem(el as HTMLSpanElement, qr);
    }
  }

  private handleQrStyleClick(qr: IQrStyleListItem, index: number) {
    this.onQrListItemClick(qr, index);
  }

  private createQrStyleClickHandler(qr: IQrStyleListItem, index: number) {
    return () => this.handleQrStyleClick(qr, index);
  }

  private createQrStyleRefHandler(qr: IQrStyleListItem) {
    return (el: Element | undefined) => this.handleQrStyleRef(el, qr);
  }

  // eslint-disable-next-line max-lines-per-function
  override render() {
    return html`
      <div class="qr-code-generator">
        <div class="grid grid-cols-1 gap-4">
          <label>
            URL/Plain Text
            <textarea
              placeholder="Please enter the contents to be encoded into the QR Code."
              rows="3"
              class="form-textarea"
              .value=${this.text}
              @keyup=${this.onTextChange}
              @change=${this.onTextChange}
            ></textarea>
          </label>
          <div class="flex justify-between gap-2">
            <label>
              Width
              <input
                class="form-input"
                type="number"
                .value=${this.width}
                @keyup=${this.handleWidthChange}
              />
            </label>
            <label>
              Height
              <input
                class="form-input"
                type="number"
                .value=${this.height}
                @keyup=${this.handleHeightChange}
              />
            </label>
          </div>
          <label>
            Margin
            <input
              class="w-full"
              .value=${this.margin}
              type="range"
              min="0"
              max="100"
              @change=${this.handleMarginChange}
            />
          </label>
          <div class="grid grid-cols-3 gap-4">
            <label>
              Background
              <input
                class="w-full"
                type="color"
                .value=${this.bgColor}
                @change=${this.handleBgColorChange}
              />
            </label>
            <label>
              Dot/Pixel
              <input
                class="w-full"
                type="color"
                .value=${this.dotColor}
                @change=${this.handleDotColorChange}
              />
            </label>
            <label>
              Corners
              <input
                class="w-full"
                type="color"
                .value=${this.squareColor}
                @change=${this.handleSquareColorChange}
              />
            </label>
          </div>
          <div class="flex justify-between items-center">
            <label>
              Logo
              <input
                class="w-full"
                type="file"
                accept="image/*"
                @change=${this.onImageUpload}
              />
            </label>
            <button
              class="btn btn-red btn-sm btn-remove"
              @click=${this.removeLogo}
            >
              Remove logo
            </button>
          </div>
          <div class="qr-style-list">
            ${repeat(
              QrStyleList,
              (qr, i) => html`
                <span
                  ${ref(this.createQrStyleRefHandler(qr))}
                  class=${i === this.selected ? 'selected' : ''}
                  @click=${this.createQrStyleClickHandler(qr, i)}
                >
                </span>
              `
            )}
          </div>
        </div>
        <div>
          <div class="text-center qr" ${ref(this.container)}></div>
          <div class="grid grid-cols-2 gap-4">
            <select class="form-select" @change=${this.handleDownloadExtChange}>
              <option>jpeg</option>
              <option>png</option>
              <option>svg</option>
              <option>webp</option>
            </select>
            <button class="btn btn-green btn-sm" @click=${this.download}>
              Download
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qr-code-generator': QrCodeGenerator;
  }
}
