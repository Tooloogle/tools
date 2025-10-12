import { ZXingCodeReader, ZXingLibrary } from './zxing-loader.util.js';

export type ScannerStatus = 'loading' | 'ready' | 'error';

export interface ScanResult {
  data: string;
  result?: unknown;
  source?: 'camera' | 'file';
}

export interface CopyResult {
  success: boolean;
  message: string;
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
      if (
        error.message.includes('Permission denied') ||
        error.name === 'NotAllowedError'
      ) {
        errorMessage += 'Please grant camera permissions.';
      } else if (
        error.message.includes('NotFoundError') ||
        error.name === 'NotFoundError'
      ) {
        errorMessage += 'No camera found.';
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

  static async copyToClipboard(text: string): Promise<CopyResult> {
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

      img.onload = () => resolve(img);
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error('Failed to load the uploaded image.'));
      };

      img.src = imageUrl;
    });
  }

  static cleanupObjectUrl(url: string, delay = 5000): void {
    setTimeout(() => URL.revokeObjectURL(url), delay);
  }

  static async initializeZXing(zxingLoader: {
    loadZXing: () => Promise<ZXingLibrary>;
  }): Promise<ZXingCodeReader> {
    const ZXing = await zxingLoader.loadZXing();
    return new ZXing.BrowserQRCodeReader();
  }

  static async startCameraScan(
    codeReader: ZXingCodeReader,
    containerId: string,
    shadowRoot?: ShadowRoot | null
  ): Promise<{ result: ScanResult; videoStream: MediaStream }> {
    const findScannerElement = () => {
      if (shadowRoot) {
        const shadowElement = shadowRoot.getElementById(containerId);
        if (shadowElement) return shadowElement;
      }

      return document.getElementById(containerId);
    };

    const scannerElement = findScannerElement();
    if (!scannerElement) {
      throw new Error('Scanner element not found');
    }

    const videoElement = this.createVideoElement();
    scannerElement.innerHTML = '';
    scannerElement.appendChild(videoElement);

    try {
      const result = await codeReader.decodeOnceFromVideoDevice(
        undefined,
        videoElement
      );
      const videoStream = videoElement.srcObject as MediaStream;

      return {
        result: {
          data: result.text,
          result: result.result,
          source: 'camera',
        },
        videoStream,
      };
    } catch (error) {
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      if (videoElement.parentNode === scannerElement) {
        scannerElement.removeChild(videoElement);
      }

      throw error;
    }
  }

  static async scanImageFile(
    codeReader: ZXingCodeReader,
    file: File
  ): Promise<ScanResult> {
    const img = await this.createImageFromFile(file);
    const result = await codeReader.decodeFromImageElement(img);
    return {
      data: result.text,
      result: result.result,
      source: 'file',
    };
  }

  static cleanupScanner(
    codeReader: ZXingCodeReader | null,
    videoStream: MediaStream | null,
    containerId: string,
    shadowRoot?: ShadowRoot | null
  ): void {
    if (codeReader) {
      try {
        codeReader.reset();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }

    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }

    // Helper function to find element in either shadow or light DOM
    const findScannerElement = () => {
      if (shadowRoot) {
        const shadowElement = shadowRoot.getElementById(containerId);
        if (shadowElement) return shadowElement;
      }

      return document.getElementById(containerId);
    };

    const scannerElement = findScannerElement();
    if (scannerElement) {
      scannerElement.innerHTML = '';
    }
  }
}
