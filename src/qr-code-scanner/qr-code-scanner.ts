import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import qrCodeScannerStyles from './qr-code-scanner.css.js';

// ZXing types
declare const ZXing: any;

@customElement('qr-code-scanner')
export class QrCodeScanner extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, qrCodeScannerStyles];
    
  @state() private status: 'loading' | 'ready' | 'error' = 'loading';
  @state() private statusMessage = 'Loading QR Scanner...';
  @state() private scanning = false;
  @state() private scannedData = '';
  @state() private error = '';
  @state() private copyFeedback = '';
  @state() private uploadedImageSrc = '';

  private codeReader: any = null;
  private videoStream: MediaStream | null = null;
  private uniqueId = `qr-reader-${Math.random().toString(36).substring(2, 9)}`;

  async firstUpdated() {
    await this.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    this.initializeScanner();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopScanning();
  }

  private async initializeScanner() {
    this.status = 'loading';
    this.statusMessage = 'Loading QR Scanner...';

    try {
      if (typeof ZXing === 'undefined') {
        throw new Error('ZXing library not loaded');
      }

      await this.updateComplete;
      
      const scannerElement = this.shadowRoot?.getElementById(this.uniqueId);
      if (!scannerElement) {
        throw new Error('Scanner element not found in shadow DOM');
      }

      // Initialize ZXing CodeReader
      this.codeReader = new ZXing.BrowserQRCodeReader();

      this.status = 'ready';
      this.statusMessage = 'QR Scanner ready!';
      this.error = '';
    } catch (error) {
      console.error('Initialization error:', error);
      this.status = 'error';
      this.statusMessage = 'Scanner initialization failed';
      this.error = this.getErrorMessage(error);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes('Permission denied')) {
        return 'Camera access denied. Please allow camera permissions.';
      } else if (error.message.includes('NotFoundError')) {
        return 'No camera found. Please ensure you have a camera connected.';
      } else if (error.message.includes('NotAllowedError')) {
        return 'Camera access denied. Please allow camera access.';
      } else if (error.message.includes('Scanner element not found')) {
        return 'Scanner setup failed. Please refresh the page.';
      }
      return `Scanner error: ${error.message}`;
    }
    return 'Failed to initialize QR scanner. Please refresh the page.';
  }

  private async startScanning() {
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

      // Create video element in shadow DOM
      const videoElement = document.createElement('video');
      videoElement.style.width = '100%';
      videoElement.style.height = 'auto';
      videoElement.style.maxHeight = '300px';
      videoElement.style.objectFit = 'contain';
      videoElement.autoplay = true;
      videoElement.playsInline = true;

      scannerElement.innerHTML = '';
      scannerElement.appendChild(videoElement);

      // Start decoding from camera
      const result = await this.codeReader.decodeOnceFromVideoDevice(
        undefined, // deviceId - undefined will use default camera
        videoElement
      );

      if (result) {
        this.handleScanSuccess(result.text, result);
      }

    } catch (error) {
      console.error('Error starting scanner:', error);
      this.handleScannerError(error);
      this.scanning = false;
    }
  }

  private async stopScanning() {
    if (this.codeReader && this.scanning) {
      try {
        this.codeReader.reset();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    
    // Stop video stream
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    this.scanning = false;
    
    // Clear the scanner element
    const scannerElement = this.shadowRoot?.getElementById(this.uniqueId);
    if (scannerElement) {
      scannerElement.innerHTML = '';
    }
  }

  private handleScannerError(error: any) {
    let errorMessage = 'Unable to access camera. ';
    if (error instanceof Error) {
      if (error.message.includes('Permission denied') || error.name === 'NotAllowedError') {
        errorMessage += 'Please grant camera permissions.';
      } else if (error.message.includes('NotFoundError') || error.name === 'NotFoundError') {
        errorMessage += 'No camera found.';
      } else if (error.message.includes('NotAllowedError') || error.name === 'NotAllowedError') {
        errorMessage += 'Camera access denied.';
      } else {
        errorMessage += 'Please ensure camera permissions are granted.';
      }
    } else {
      errorMessage += 'Please ensure camera permissions are granted.';
    }
    
    this.error = errorMessage;
  }

  private handleScanSuccess(decodedText: string, decodedResult: any) {
    this.scannedData = decodedText;
    this.stopScanning();
    this.error = '';
    
    this.dispatchEvent(new CustomEvent('qr-scanned', {
      detail: { data: decodedText, result: decodedResult },
      bubbles: true,
      composed: true
    }));
  }

  private async handleFileUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    if (!this.codeReader || this.status !== 'ready') {
      this.error = 'QR Scanner is not ready. Please wait for initialization to complete.';
      return;
    }

    this.error = '';
    
    // Create a URL for the uploaded image to display
    const imageUrl = URL.createObjectURL(file);
    this.uploadedImageSrc = imageUrl;
    
    try {
      // Create an image element to load the file
      const img = new Image();
      
      img.onload = async () => {
        try {
          const result = await this.codeReader.decodeFromImageElement(img);
          this.scannedData = result.text;
          this.dispatchEvent(new CustomEvent('qr-scanned', {
            detail: { data: result.text, source: 'file' },
            bubbles: true,
            composed: true
          }));
        } catch (error) {
          console.error('Error scanning file:', error);
          this.error = 'No QR code found in the uploaded image.';
        }
      };
      
      img.onerror = () => {
        this.error = 'Failed to load the uploaded image.';
      };
      
      img.src = imageUrl;
      
    } catch (error) {
      console.error('Error processing file:', error);
      this.error = 'Failed to process the uploaded image.';
    } finally {
      input.value = '';
      // Clean up the object URL after a delay to allow display
      setTimeout(() => {
        if (this.uploadedImageSrc === imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      }, 5000);
    }
  }

  private async copyToClipboard() {
    if (!this.scannedData) return;

    try {
      await navigator.clipboard.writeText(this.scannedData);
      this.copyFeedback = 'Copied!';
      
      this.dispatchEvent(new CustomEvent('qr-copied', {
        detail: { data: this.scannedData },
        bubbles: true,
        composed: true
      }));
      
      setTimeout(() => {
        this.copyFeedback = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      this.copyFeedback = 'Copy failed';
      setTimeout(() => {
        this.copyFeedback = '';
      }, 2000);
    }
  }

  private clearResult() {
    this.scannedData = '';
    this.error = '';
    this.copyFeedback = '';
    this.uploadedImageSrc = '';
    
    this.dispatchEvent(new CustomEvent('qr-cleared', {
      bubbles: true,
      composed: true
    }));
  }

  private isUrl(text: string): boolean {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  }

  render() {
    return html`
      <div class="container">
        <h1 class="title">QR Code Scanner</h1>
        
           ${this.scannedData ? html`
          <div class="result-section">
          <div class="result-header">
            <h3>Scanned Data URL</h3>
             <div class="result-actions">
                <button class="btn btn-primary" @click="${this.copyToClipboard}">
                  ${this.copyFeedback || 'Copy'}
                </button>
                <button class="btn btn-secondary" @click="${this.clearResult}">
                  Clear
                </button>
              </div>
              </div>
              <div class="result-content">
                ${this.isUrl(this.scannedData) ? html`
                  <a href="${this.scannedData}" target="_blank" rel="noopener noreferrer">
                    ${this.scannedData}
                  </a>
                ` : html`
                  <span>${this.scannedData}</span>
                `}
              </div>
          </div>
        ` : ''}
        <div class="scanner-section">
          <div class="camera-container" style="position: relative; padding: 10px;">
            <div id="${this.uniqueId}" style="width: 100%; min-height: 300px;"></div>
            ${!this.scanning ? html`
              <div class="placeholder">
                <p>Camera scanner will appear here</p>
              </div>
            ` : ''}
          </div>
          
        ${this.scanning ? html`
          <div class="scanning-indicator">
            <div class="scanning-animation"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div>
            <p>Point your camera at a QR code...</p>
          </div>
        ` : ''}
        ${!this.scanning ? html`<div class="status ${this.status}">${this.statusMessage}</div> ` : ''}
          <div class="controls">
            ${!this.scanning ? html`
              <button 
                class="btn btn-primary" 
                @click="${this.startScanning}"
                ?disabled="${this.status !== 'ready'}"
              >
                Start Camera Scan
              </button>
            ` : html`
              <button class="btn btn-destructive" @click="${this.stopScanning}">
                Stop Scanning
              </button>
            `}
          </div>
        </div>
       
        <div class="upload-section" >
          <label class="upload-label ${this.status !== 'ready' ? 'disabled' : ''}">
          <span class="upload-icon">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-qr-code-icon lucide-qr-code"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
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

        ${this.uploadedImageSrc ? html`
          <div class="uploaded-image-section">
            <h3 style="text-align:center">Uploaded Image</h3>
            <div style="display: flex; items-center: center; justify-content: center; margin-bottom: 10px;">
              <img src="${this.uploadedImageSrc}" alt="Uploaded QR code image" style="max-width: 100%; max-height: 250px; object-fit: contain;" />
            </div>
          </div>
        ` : ''}

        ${this.error ? html`
          <div class="error-message">
            ${this.error}
          </div>
        ` : ''}

        
        <ul class="note">
          <li>Point your camera at a QR code or upload an image</li>
          <li>Scanning happens entirely in your browser</li>
          <li>Supports various QR code types</li>
          <li>Make sure the QR code is well-lit and clearly visible</li>
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'qr-code-scanner': QrCodeScanner;
  }
}