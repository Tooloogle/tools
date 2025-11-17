import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import qrCodeScannerStyles from './qr-code-scanner.css.js';
import { Html5Qrcode } from 'html5-qrcode';
import type { Html5QrcodeResult } from 'html5-qrcode/esm/core';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-copy-button/t-copy-button.js';

import {
  cleanupScanner,
  createScanner,
  patchGetElementById,
  restoreGetElementById,
  scanFile,
  startScanner,
  stopScanner,
} from './qr-code-scanner.utils.js';

type ScannerStatus = 'loading' | 'ready' | 'scanning' | 'error';

export interface ScanResult {
  data: string;
  format?: string;
}

@customElement('qr-code-scanner')
export class QrCodeScanner extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    buttonStyles,
    qrCodeScannerStyles,
  ];

  @state() status: ScannerStatus = 'ready';
  @state() scanning = false;
  @state() scannedData = '';
  @state() error = '';
  @state() copyFeedback = '';

  html5QrCode: Html5Qrcode | null = null;
  uniqueId = `qr-reader-${Math.random().toString(36).substr(2, 9)}`;
  originalGetElementById: ((id: string) => HTMLElement | null) | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    if (!isBrowser()) {
      this.error = 'QR code scanner is only available in browser environments.';
      this.status = 'error';
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
  }

  private cleanup(): void {
    restoreGetElementById(this);
    cleanupScanner(this);
    this.scanning = false;
  }

  private async startScanning(): Promise<void> {
    if (this.scanning || !isBrowser()) return;

    this.error = '';
    this.scanning = true;
    this.status = 'scanning';

    await this.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const readerElement = this.shadowRoot?.getElementById(this.uniqueId);
      if (!readerElement) {
        throw new Error('Reader element not found in shadow DOM');
      }

      patchGetElementById(this, readerElement);
      this.html5QrCode = createScanner(this.uniqueId);

      await startScanner(
        this.html5QrCode,
        this.onScanSuccess.bind(this),
        this.onScanFailure.bind(this)
      );
    } catch (error) {
      restoreGetElementById(this);
      this.handleScanError(error);
    }
  }

  private async stopScanning(): Promise<void> {
    await stopScanner(this);
  }

  private onScanSuccess(decodedText: string, result: Html5QrcodeResult): void {
    this.scannedData = decodedText;
    this.error = '';
    void this.stopScanning();
    this.dispatchScanEvent('qr-scanned', {
      data: decodedText,
      format: result.result.format?.formatName,
    });
  }

  private onScanFailure(errorMessage: string): void {
    if (!errorMessage.includes('No MultiFormat Readers')) {
      console.error('Scan failure:', errorMessage);
    }
  }

  private handleScanError(error: unknown): void {
    console.error('Error starting scanner:', error);
    this.scanning = false;
    this.status = 'error';

    if (error instanceof Error) {
      if (
        error.message.includes('NotAllowedError') ||
        error.message.includes('Permission')
      ) {
        this.error =
          'Camera permission denied. Please allow camera access and try again.';
      } else if (error.message.includes('NotFoundError')) {
        this.error = 'No camera found on this device.';
      } else {
        this.error = `Failed to start camera: ${error.message}`;
      }
    } else {
      this.error = 'Failed to start the camera scanner.';
    }
  }

  private async handleFileUpload(e: Event): Promise<void> {
    if (!isBrowser()) return;

    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.error = '';

    try {
      const result = await scanFile(this.uniqueId, file);
      this.scannedData = result;
      this.dispatchScanEvent('qr-scanned', { data: result });
    } catch (error) {
      this.handleFileScanError(error);
    } finally {
      input.value = '';
    }
  }

  private handleFileScanError(error: unknown): void {
    console.error('Error scanning file:', error);
    if (
      error instanceof Error &&
      error.message.includes('No MultiFormat Readers')
    ) {
      this.error =
        'No QR code found in the uploaded image. Please upload an image containing a valid QR code.';
    } else {
      this.error =
        'Failed to process the uploaded image. Please try a different image.';
    }
  }

  private dispatchScanEvent(type: string, detail: ScanResult): void {
    this.dispatchEvent(
      new CustomEvent(type, { detail, bubbles: true, composed: true })
    );
  }

  private renderNote() {
    return html`
      <ul class="note">
        <li>Point your camera at a QR code or upload an image</li>
        <li>Scanning happens entirely in your browser</li>
        <li>Supports various QR code types</li>
        <li>Make sure the QR code is well-lit and clearly visible</li>
      </ul>
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="qr-controls">
          ${this.scanning
            ? html`<button @click="${this.stopScanning}" class="btn btn-red">
                Stop Scanning
              </button>`
            : html`
                <button
                  @click="${this.startScanning}"
                  class="btn btn-blue"
                  ?disabled="${this.status === 'error'}"
                >
                  Start Camera Scanner
                </button>
                <label class="btn btn-green btn-upload">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    @change="${this.handleFileUpload}"
                    class="hidden"
                  />
                </label>
              `}
        </div>

        ${this.error
          ? html`
              <div class="qr-error"><strong>Error:</strong> ${this.error}</div>
            `
          : ''}
        ${!this.error && this.scannedData
          ? html`
              <code>${this.scannedData}</code>
              <t-copy-button .text=${this.scannedData}></t-copy-button>
            `
          : ''}
        ${this.scanning
          ? html`
              <div class="qr-scanner-wrapper">
                <div id="${this.uniqueId}" class="qr-reader"></div>
              </div>
            `
          : ''}
        ${this.renderNote()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qr-code-scanner': QrCodeScanner;
  }
}
