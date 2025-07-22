import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import qrCodeScannerStyles from './qr-code-scanner.css.js';
import {  QrScannerUtils, type ZXingCodeReader, type ScannerStatus, type ScanResult, QrScannerRenderer} from './qr-code-scanner.utils.js';

@customElement('qr-code-scanner')
export class QrCodeScanner extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, qrCodeScannerStyles];
    
  @state() private status: ScannerStatus = 'loading';
  @state() private statusMessage = 'Loading QR Scanner...';
  @state() private scanning = false;
  @state() private scannedData = '';
  @state() private error = '';
  @state() private copyFeedback = '';
  @state() private uploadedImageSrc = '';

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
    this.statusMessage = 'Loading QR Scanner...';

    try {
      if (typeof window.ZXing === 'undefined') {
        throw new Error('ZXing library not loaded');
      }

      await this.updateComplete;
      const scannerElement = this.shadowRoot?.getElementById(this.uniqueId);
      if (!scannerElement) {
        throw new Error('Scanner element not found in shadow DOM');
      }

      this.codeReader = new window.ZXing.BrowserQRCodeReader();
      this.status = 'ready';
      this.statusMessage = 'QR Scanner ready!';
      this.error = '';
    } catch (error) {
      console.error('Initialization error:', error);
      this.status = 'error';
      this.statusMessage = 'Scanner initialization failed';
      this.error = QrScannerUtils.getErrorMessage(error);
    }
  }

  private async startScanning(): Promise<void> {
    if (!this.codeReader || this.status !== 'ready') {
      this.error = 'QR Scanner is not ready. Please wait for initialization to complete.';
      return;
    }

    this.error = '';
    this.scanning = true;
    try {
      const scannerElement = this.shadowRoot?.getElementById(this.uniqueId);
      if (!scannerElement) {
        throw new Error('Scanner element not found');
      }

      const videoElement = QrScannerUtils.createVideoElement();
      scannerElement.innerHTML = '';
      scannerElement.appendChild(videoElement);
      const result = await this.codeReader.decodeOnceFromVideoDevice(undefined, videoElement);
      if (result) {
        this.handleScanSuccess(result.text, result);
      }

    } catch (error) {
      console.error('Error starting scanner:', error);
      this.error = QrScannerUtils.handleScannerError(error);
      this.scanning = false;
    }
  }

  private async stopScanning(): Promise<void> {
    if (this.codeReader && this.scanning) {
      try {
        this.codeReader.reset();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    this.scanning = false;
    
    const scannerElement = this.shadowRoot?.getElementById(this.uniqueId);
    if (scannerElement) {
      scannerElement.innerHTML = '';
    }
  }

  private handleScanSuccess(decodedText: string, decodedResult: unknown): void {
    this.scannedData = decodedText;
    void this.stopScanning();
    this.error = '';
    
    this.dispatchEvent(new CustomEvent('qr-scanned', {
      detail: { data: decodedText, result: decodedResult } as ScanResult,
      bubbles: true,
      composed: true
    }));
  }

  private async handleFileUpload(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file || !this.codeReader || this.status !== 'ready') {
      if (!file) return;
      this.error = 'QR Scanner is not ready. Please wait for initialization to complete.';
      return;
    }

    this.error = '';
    const imageUrl = URL.createObjectURL(file);
    this.uploadedImageSrc = imageUrl;
    
    try {
      const img = await QrScannerUtils.createImageFromFile(file);
      
      try {
        const result = await this.codeReader.decodeFromImageElement(img);
        this.scannedData = result.text;
        this.dispatchEvent(new CustomEvent('qr-scanned', {
          detail: { data: result.text, source: 'file' } as ScanResult,
          bubbles: true,
          composed: true
        }));
      } catch (error) {
        console.error('Error scanning file:', error);
        this.error = 'No QR code found in the uploaded image.';
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      this.error = 'Failed to process the uploaded image.';
    } finally {
      input.value = '';
      QrScannerUtils.cleanupObjectUrl(imageUrl);
    }
  }

  private async copyToClipboard(): Promise<void> {
    if (!this.scannedData) return;

    const result = await QrScannerUtils.copyToClipboard(this.scannedData);
    this.copyFeedback = result.message;
    
    if (result.success) {
      this.dispatchEvent(new CustomEvent('qr-copied', {
        detail: { data: this.scannedData } as ScanResult,
        bubbles: true,
        composed: true
      }));
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

  private renderResult() {
    return QrScannerRenderer.renderResultSection(
      this.scannedData, 
      this.copyFeedback, 
      () => void this.copyToClipboard(), 
      () => void this.clearResult()
    );
  }

  private renderControls() {
    return QrScannerRenderer.renderControls(
      this.scanning,
      this.status,
      () => void this.startScanning(),
      () => void this.stopScanning()
    );
  }

  private renderUploadedImage() {
    return QrScannerRenderer.renderUploadedImage(this.uploadedImageSrc);
  }

  private renderError() {
    return QrScannerRenderer.renderError(this.error);
  }
 
  private renderScannerSection() {
    return html`
      <div class="scanner-section">
        <div class="camera-container" style="position: relative; padding: 10px;">
          <div id="${this.uniqueId}" style="width: 100%; min-height: 300px;"></div>
          ${!this.scanning ? html`
            <div class="placeholder">
              <p>Camera scanner will appear here</p>
            </div>
          ` : ''}
        </div>
        
        ${this.renderScanningIndicator()}
        ${this.renderStatusMessage()}
        ${this.renderControls()}
      </div>
    `;
  }

  private renderStatusMessage() {
    if (this.scanning) return '';

    return html`<div class="status ${this.status}">${this.statusMessage}</div>`;
  }

  private renderScanningIndicator() {
  if (!this.scanning) return '';
  return QrScannerRenderer.renderScanningIndicator();
}

private renderUploadSection() {
  return html`
    <div class="upload-section">
      <label class="upload-label ${this.status !== 'ready' ? 'disabled' : ''}">
        <span class="upload-icon">
          ${QrScannerRenderer.renderUploadIcon()}
          Upload an image containing a QR code
        </span>
        <input 
          type="file" 
          accept="image/*" 
          @change="${this.handleFileUpload}"
          ?disabled="${this.status !== 'ready'}"
        />
      </label>
    </div>
  `;
}

private renderNotes() {
  return QrScannerRenderer.renderNotes();
}

  render() {
    return html`
      <div class="container">
        <h1 class="title">QR Code Scanner</h1>
        ${this.renderResult()}
        ${this.renderScannerSection()}
        ${this.renderUploadSection()}
        ${this.renderUploadedImage()}
        ${this.renderError()}
        ${this.renderNotes()}
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'qr-code-scanner': QrCodeScanner;
  }
}