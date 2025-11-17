import { Html5Qrcode } from 'html5-qrcode';
import type {
  Html5QrcodeResult,
  Html5QrcodeError,
} from 'html5-qrcode/esm/core';
import type { QrCodeScanner } from './qr-code-scanner.js';

export function createScanner(elementId: string): Html5Qrcode {
  return new Html5Qrcode(elementId, {
    verbose: false,
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true,
    },
  });
}

export async function startScanner(
  scanner: Html5Qrcode,
  onSuccess: (text: string, result: Html5QrcodeResult) => void,
  onFailure: (message: string, error: Html5QrcodeError) => void
): Promise<void> {
  const config = {
    fps: 10,
    qrbox: { width: 350, height: 350 },
    aspectRatio: 1.0,
  };

  await scanner.start(
    { facingMode: 'environment' },
    config,
    onSuccess,
    onFailure
  );
}

export async function stopScanner(component: QrCodeScanner): Promise<void> {
  if (!component.html5QrCode || !component.scanning) return;

  try {
    if (component.html5QrCode.isScanning) {
      await component.html5QrCode.stop();
    }

    component.html5QrCode.clear();
    component.html5QrCode = null;
    component.scanning = false;
    component.status = 'ready';
  } catch (error) {
    console.error('Error stopping scanner:', error);
    component.scanning = false;
    component.status = 'ready';
  }
}

export function cleanupScanner(component: QrCodeScanner): void {
  if (component.html5QrCode) {
    if (component.html5QrCode.isScanning) {
      component.html5QrCode.stop().catch(console.error);
    }

    component.html5QrCode.clear();
    component.html5QrCode = null;
  }
}

export async function scanFile(elementId: string, file: File): Promise<string> {
  const tempScanner = new Html5Qrcode(elementId, { verbose: false });
  const result = await tempScanner.scanFile(file, true);
  await tempScanner.clear();
  return result;
}

export function patchGetElementById(
  component: QrCodeScanner,
  element: Element
): void {
  component.originalGetElementById = document.getElementById.bind(document);
  document.getElementById = (id: string) => {
    if (id === component.uniqueId) {
      return element as HTMLElement;
    }

    return component.originalGetElementById!(id);
  };
}

export function restoreGetElementById(component: QrCodeScanner): void {
  if (component.originalGetElementById) {
    document.getElementById = component.originalGetElementById;
    component.originalGetElementById = null;
  }
}
