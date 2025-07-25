import { html } from "lit";
import { QrScannerUtils, ScannerStatus } from "./qr-code-scanner.utils.js";

export class QrScannerRenderer {
    static renderScanningIndicator() {
        return html`
      <div class="scanning-indicator">
        <div class="scanning-animation">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-loader-circle-icon lucide-loader-circle"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
        <p>Point your camera at a QR code...</p>
      </div>
    `;
    }

    static renderUploadIcon() {
        return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-qr-code-icon lucide-qr-code"
      >
        <rect width="5" height="5" x="3" y="3" rx="1" />
        <rect width="5" height="5" x="16" y="3" rx="1" />
        <rect width="5" height="5" x="3" y="16" rx="1" />
        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
        <path d="M21 21v.01" />
        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
        <path d="M3 12h.01" />
        <path d="M12 3h.01" />
        <path d="M12 16v.01" />
        <path d="M16 12h1" />
        <path d="M21 12v.01" />
        <path d="M12 21v-1" />
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

    static renderResultSection(
        scannedData: string,
        copyFeedback: string,
        onCopy: () => void,
        onClear: () => void
    ) {
        if (!scannedData) return html``;

        return html`
      <div class="result-section">
        <div class="result-header">
          <h3>Scanned Data URL</h3>
          <div class="result-actions">
            <button class="btn btn-primary" @click=${onCopy}>
              ${copyFeedback || "Copy"}
            </button>
            <button class="btn btn-secondary" @click=${onClear}>Clear</button>
          </div>
        </div>
        <div class="result-content">
          ${QrScannerUtils.isUrl(scannedData)
                ? html`<a href="${scannedData}" target="_blank" rel="noopener noreferrer">${scannedData}</a>`
                : html`<span>${scannedData}</span>`}
        </div>
      </div>
    `;
    }

    static renderControls(
        scanning: boolean,
        status: ScannerStatus,
        onStart: () => void,
        onStop: () => void
    ) {
        return html`
      <div class="controls">
        ${!scanning
                ? html`<button class="btn btn-primary" @click=${onStart} ?disabled=${status !== "ready"}>
               Start Camera Scan
             </button>`
                : html`<button class="btn btn-destructive" @click=${onStop}>
               Stop Scanning
             </button>`}
      </div>
    `;
    }

    static renderUploadedImage(uploadedImageSrc: string) {
        if (!uploadedImageSrc) return html``;
        return html`
      <div class="uploaded-image-section">
        <h3 style="text-align:center">Uploaded Image</h3>
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <img
            src="${uploadedImageSrc}"
            alt="Uploaded QR code image"
            style="max-width: 100%; max-height: 250px; object-fit: contain;"
          />
        </div>
      </div>
    `;
    }

    static renderError(error: string) {
        if (!error) return html``;
        return html`<div class="error-message">${error}</div>`;
    }

    static renderStatusMessage(status: ScannerStatus, statusMessage: string, libraryLoading: boolean) {
        if (status === 'loading' || libraryLoading) {
            return html`
        <div class="status ${libraryLoading ? 'loading' : status}">
          ${libraryLoading ? html`<span class="loading-spinner"></span>` : ''}
          ${statusMessage}
        </div>
      `;
        }

        return html``;
    }

    static renderScannerSection(
        uniqueId: string,
        scanning: boolean,
        status: ScannerStatus,
        statusMessage: string,
        libraryLoading: boolean,
        onStart: () => void,
        onStop: () => void
    ) {
        return html`
      <div class="scanner-section">
        <div class="camera-container" style="position: relative; padding: 10px;">
          <div id="${uniqueId}" style="width: 100%; min-height: 300px;"></div>
          ${!scanning ? html`
            <div class="placeholder">
              <p>Camera scanner will appear here</p>
            </div>
          ` : ''}
        </div>
        ${scanning ? this.renderScanningIndicator() : ''}
        ${this.renderStatusMessage(status, statusMessage, libraryLoading)}
        ${this.renderControls(scanning, status, onStart, onStop)}
      </div>
    `;
    }

    static renderUploadSection(
        status: ScannerStatus,
        libraryLoading: boolean,
        onFileUpload: (e: Event) => void
    ) {
        const isDisabled = status !== 'ready' || libraryLoading;
        return html`
      <div class="upload-section">
        <label class="upload-label ${isDisabled ? 'disabled' : ''}">
          <span class="upload-icon">
            ${this.renderUploadIcon()}
            Upload an image containing a QR code
          </span>
          <input 
            type="file" 
            accept="image/*" 
            @change=${onFileUpload}
            ?disabled=${isDisabled}
          />
        </label>
      </div>
    `;
    }
}