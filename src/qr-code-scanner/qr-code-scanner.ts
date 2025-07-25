import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import qrCodeScannerStyles from './qr-code-scanner.css.js';
import { QrScannerUtils, type ScannerStatus, type ScanResult } from './qr-code-scanner.utils.js';
import { zxingLoader, type ZXingCodeReader, } from './zxing-loader.util.js';
import { QrScannerRenderer } from './qr-code-scanner.renderer.js';

@customElement('qr-code-scanner')
export class QrCodeScanner extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, qrCodeScannerStyles];

  @state() private status: ScannerStatus = 'loading';
  @state() private statusMessage = 'Initializing QR Scanner...';
  @state() private scanning = false;
  @state() private scannedData = '';
  @state() private error = '';
  @state() private copyFeedback = '';
  @state() private uploadedImageSrc = '';
  @state() private libraryLoading = false;

  private codeReader: ZXingCodeReader | null = null;
  private videoStream: MediaStream | null = null;
  private uniqueId = QrScannerUtils.generateUniqueId();

  async firstUpdated(): Promise<void> {
    await this.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    void this.initializeScanner();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    void this.stopScanning();
  }

  private async initializeScanner(): Promise<void> {
    this.status = 'loading';
    this.statusMessage = 'Loading ZXing library...';
    this.libraryLoading = true;
    this.error = '';

    try {
      this.codeReader = await QrScannerUtils.initializeZXing(zxingLoader);
      this.status = 'ready';
      this.statusMessage = 'QR Scanner ready!';
    } catch (error) {
      this.handleInitializationError(error);
    } finally {
      this.libraryLoading = false;
    }
  }

  private handleInitializationError(error: unknown): void {
    console.error('Scanner initialization error:', error);
    this.status = 'error';

    if (error instanceof Error) {
      if (error.message.includes('Failed to load ZXing library')) {
        this.statusMessage = 'Failed to load QR scanner library';
        this.error = 'Could not load the QR scanning library. Please check your internet connection and try again.';
      } else {
        this.statusMessage = 'Scanner initialization failed';
        this.error = QrScannerUtils.getErrorMessage(error);
      }
    } else {
      this.statusMessage = 'Unknown initialization error';
      this.error = 'An unknown error occurred during initialization.';
    }
  }

  private async retryInitialization(): Promise<void> {
    this.error = '';
    await this.initializeScanner();
  }

  private async startScanning(): Promise<void> {
    if (!this.codeReader || this.status !== 'ready') {
      this.error = 'QR Scanner is not ready. Please wait for initialization to complete.';
      return;
    }

    this.error = '';
    this.scanning = true;

    try {
      const { result, videoStream } = await QrScannerUtils.startCameraScan(
        this.codeReader,
        this.uniqueId,
        this.shadowRoot
      );
      this.videoStream = videoStream;
      this.handleScanSuccess(result);
    } catch (error) {
      this.handleScanError(error);
    }
  }

  private async stopScanning(): Promise<void> {
    QrScannerUtils.cleanupScanner(
      this.codeReader,
      this.videoStream,
      this.uniqueId,
      this.shadowRoot
    );
    this.scanning = false;
    this.videoStream = null;
  }

  private handleScanSuccess(result: ScanResult): void {
    this.scannedData = result.data;
    this.uploadedImageSrc = '';
    this.error = '';
    void this.stopScanning();
    this.dispatchScanEvent('qr-scanned', result);
  }

  private handleScanError(error: unknown): void {
    console.error('Error starting scanner:', error);
    this.error = QrScannerUtils.getErrorMessage(error);
    this.scanning = false;
  }

  private async handleFileUpload(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.codeReader || this.status !== 'ready') return;

    this.error = '';
    const imageUrl = URL.createObjectURL(file);
    this.uploadedImageSrc = imageUrl;

    try {
      const result = await QrScannerUtils.scanImageFile(this.codeReader, file);
      this.scannedData = result.data;
      this.dispatchScanEvent('qr-scanned', result);
    } catch (error) {
      this.handleFileScanError(error);
    } finally {
      input.value = '';
      QrScannerUtils.cleanupObjectUrl(imageUrl);
    }
  }

  private handleFileScanError(error: unknown): void {
    console.error('Error scanning file:', error);
    this.error = error instanceof Error && error.message.includes('No QR code found')
      ? 'No QR code found in the uploaded image.'
      : 'Failed to process the uploaded image.';
  }

  private dispatchScanEvent(type: string, detail: ScanResult): void {
    this.dispatchEvent(new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  private async copyToClipboard(): Promise<void> {
    if (!this.scannedData) return;

    const result = await QrScannerUtils.copyToClipboard(this.scannedData);
    this.copyFeedback = result.message;

    if (result.success) {
      this.dispatchScanEvent('qr-copied', { data: this.scannedData });
    }

    setTimeout(() => {
      this.copyFeedback = '';
    }, 2000);
  }

  private clearResult(): void {
    this.scannedData = '';
    this.error = '';
    this.copyFeedback = '';
    this.uploadedImageSrc = '';
    this.dispatchEvent(new CustomEvent('qr-cleared', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="container">
        <h1 class="title">QR Code Scanner</h1>
        ${QrScannerRenderer.renderResultSection(
      this.scannedData,
      this.copyFeedback,
      () => void this.copyToClipboard(),
      () => this.clearResult()
    )}
        ${QrScannerRenderer.renderScannerSection(
      this.uniqueId,
      this.scanning,
      this.status,
      this.statusMessage,
      this.libraryLoading,
      () => void this.startScanning(),
      () => void this.stopScanning()
    )}
        ${QrScannerRenderer.renderUploadSection(
      this.status,
      this.libraryLoading,
      (e: Event) => void this.handleFileUpload(e)
    )}
        ${QrScannerRenderer.renderUploadedImage(this.uploadedImageSrc)}
        ${this.error ? QrScannerRenderer.renderError(this.error) : ''}
        ${this.status === 'error' ? html`
          <button 
            @click="${this.retryInitialization}" 
            class="btn btn-secondary"
            style="margin-top: 10px;"
          >
            Retry Initialization
          </button>
        ` : ''}
        ${QrScannerRenderer.renderNotes()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qr-code-scanner': QrCodeScanner;
  }
}