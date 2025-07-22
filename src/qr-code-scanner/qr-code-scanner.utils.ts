import { html } from "lit";

interface ZXingCodeReader {
  decodeOnceFromVideoDevice: (deviceId: string | undefined, videoElement: HTMLVideoElement) => Promise<ZXingResult>;
  decodeFromImageElement: (imageElement: HTMLImageElement) => Promise<ZXingResult>;
  reset: () => void;
}

interface ZXingResult {
  text: string;
  result?: unknown;
}

interface ZXingLibrary {
  BrowserQRCodeReader: new () => ZXingCodeReader;
}

declare global {
  interface Window {
    ZXing: ZXingLibrary;
  }
}

export type { ZXingCodeReader, ZXingResult, ZXingLibrary };

export type ScannerStatus = 'loading' | 'ready' | 'error';

export interface ScanResult {
  data: string;
  result?: unknown;
  source?: string;
}

export class QrScannerUtils {
  static getErrorMessage(error: unknown): string {
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

  static handleScannerError(error: unknown): string {
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
    
    return errorMessage;
  }

  static isUrl(text: string): boolean {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  }

  static createVideoElement(): HTMLVideoElement {
    const videoElement = document.createElement('video');
    videoElement.style.width = '100%';
    videoElement.style.height = 'auto';
    videoElement.style.maxHeight = '300px';
    videoElement.style.objectFit = 'contain';
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    return videoElement;
  }

  static generateUniqueId(): string {
    return `qr-reader-${Math.random().toString(36).substring(2, 9)}`;
  }

  static async copyToClipboard(text: string): Promise<{ success: boolean; message: string }> {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, message: 'Copied!' };
    } catch (error) {
      console.error('Failed to copy:', error);
      return { success: false, message: 'Copy failed' };
    }
  }

  static createImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        resolve(img);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error('Failed to load the uploaded image.'));
      };
      
      img.src = imageUrl;
    });
  }

  static cleanupObjectUrl(url: string, delay = 5000): void {
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, delay);
  }
}

export class QrScannerRenderer {
  static renderScanningIndicator() {
    return html`
      <div class="scanning-indicator">
        <div class="scanning-animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <p>Point your camera at a QR code...</p>
      </div>
    `;
  }

  static renderUploadIcon() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-qr-code-icon lucide-qr-code">
        <rect width="5" height="5" x="3" y="3" rx="1"/>
        <rect width="5" height="5" x="16" y="3" rx="1"/>
        <rect width="5" height="5" x="3" y="16" rx="1"/>
        <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
        <path d="M21 21v.01"/>
        <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
        <path d="M3 12h.01"/>
        <path d="M12 3h.01"/>
        <path d="M12 16v.01"/>
        <path d="M16 12h1"/>
        <path d="M21 12v.01"/>
        <path d="M12 21v-1"/>
      </svg>
    `;
  }

  static renderNotes() {
    return html`
      <ul class="note">
        <li>Point your camera at a QR code or upload an image</li>
        <li>Scanning happens entirely in your browser</li>
        <li>Supports various QR code types</li>
        <li>Make sure the QR code is well-lit and clearly visible</li>
      </ul>
    `;
  }

  static renderResultSection(scannedData: string, copyFeedback: string, onCopy: () => void, onClear: () => void) {
    if (!scannedData) return '';

    return html`
      <div class="result-section">
        <div class="result-header">
          <h3>Scanned Data URL</h3>
          <div class="result-actions">
            <button class="btn btn-primary" @click="${onCopy}">
              ${copyFeedback || 'Copy'}
            </button>
            <button class="btn btn-secondary" @click="${onClear}">
              Clear
            </button>
          </div>
        </div>
        <div class="result-content">
          ${QrScannerUtils.isUrl(scannedData) ? html`
            <a href="${scannedData}" target="_blank" rel="noopener noreferrer">
              ${scannedData}
            </a>
          ` : html`
            <span>${scannedData}</span>
          `}
        </div>
      </div>
    `;
  }

  static renderControls(scanning: boolean, status: ScannerStatus, onStart: () => void, onStop: () => void) {
    return html`
      <div class="controls">
        ${!scanning ? html`
          <button 
            class="btn btn-primary" 
            @click="${onStart}"
            ?disabled="${status !== 'ready'}"
          >
            Start Camera Scan
          </button>
        ` : html`
          <button class="btn btn-destructive" @click="${onStop}">
            Stop Scanning
          </button>
        `}
      </div>
    `;
  }

  static renderUploadedImage(uploadedImageSrc: string) {
    if (!uploadedImageSrc) return '';

    return html`
      <div class="uploaded-image-section">
        <h3 style="text-align:center">Uploaded Image</h3>
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <img src="${uploadedImageSrc}" alt="Uploaded QR code image" style="max-width: 100%; max-height: 250px; object-fit: contain;" />
        </div>
      </div>
    `;
  }

  static renderError(error: string) {
    if (!error) return '';

    return html`
      <div class="error-message">
        ${error}
      </div>
    `;
  }
  
}