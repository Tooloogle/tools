import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageToIcoConverterStyles from './image-to-ico-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

/**
 * ICO file format sizes (standard favicon sizes)
 */
const ICO_SIZES = [16, 32, 48, 64, 128, 256];

@customElement('image-to-ico-converter')
export class ImageToIcoConverter extends WebComponentBase<IConfigBase> {
    static override styles = [
        WebComponentBase.styles,
        inputStyles,
        buttonStyles,
        imageToIcoConverterStyles,
    ];

    @property({ type: Object })
    file: File | null = null;

    @property({ type: String })
    previewUrl = '';

    @property({ type: Array })
    selectedSizes: number[] = [16, 32, 48];

    @property({ type: Boolean })
    isConverting = false;

    private handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.file = input.files?.[0] ?? null;
        
        if (this.file) {
            this.previewUrl = URL.createObjectURL(this.file);
        } else {
            this.previewUrl = '';
        }
    }

    private toggleSize(size: number) {
        if (this.selectedSizes.includes(size)) {
            this.selectedSizes = this.selectedSizes.filter(s => s !== size);
        } else {
            this.selectedSizes = [...this.selectedSizes, size].sort((a, b) => a - b);
        }
    }

    /**
     * Creates ICO file header (6 bytes)
     * @see https://en.wikipedia.org/wiki/ICO_(file_format)
     */
    private createIcoHeader(numImages: number): ArrayBuffer {
        const buffer = new ArrayBuffer(6);
        const view = new DataView(buffer);

        view.setUint16(0, 0, true);          // Reserved (must be 0)
        view.setUint16(2, 1, true);          // Image type: 1 for ICO
        view.setUint16(4, numImages, true);  // Number of images

        return buffer;
    }

    /**
     * Creates ICO directory entry (16 bytes per image)
     */
    private createIcoEntry(
        width: number,
        height: number,
        dataSize: number,
        dataOffset: number
    ): ArrayBuffer {
        const buffer = new ArrayBuffer(16);
        const view = new DataView(buffer);

        // Width/height: 0 means 256
        view.setUint8(0, width >= 256 ? 0 : width);
        view.setUint8(1, height >= 256 ? 0 : height);
        view.setUint8(2, 0);                   // Color palette
        view.setUint8(3, 0);                   // Reserved
        view.setUint16(4, 1, true);            // Color planes
        view.setUint16(6, 32, true);           // Bits per pixel
        view.setUint32(8, dataSize, true);     // Image data size
        view.setUint32(12, dataOffset, true);  // Offset to image data

        return buffer;
    }

    /**
     * Resizes image to specified size and returns PNG data
     */
    private async resizeImage(img: HTMLImageElement, size: number): Promise<ArrayBuffer> {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }

        // Draw image with high quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);

        // Get PNG data
        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(b => {
                if (b) {
                    resolve(b);
                } else {
                    reject(new Error('Failed to create blob'));
                }
            }, 'image/png');
        });

        return blob.arrayBuffer();
    }

    /**
     * Converts image to ICO format
     */
    private async convert() {
        if (!this.file || this.selectedSizes.length === 0) {
            return;
        }

        this.isConverting = true;

        try {
            // Load image
            const img = await this.loadImage(this.file);
            
            // Generate PNG data for each size
            const pngDataList: ArrayBuffer[] = [];
            for (const size of this.selectedSizes) {
                const pngData = await this.resizeImage(img, size);
                pngDataList.push(pngData);
            }

            // Calculate offsets
            const headerSize = 6;
            const entrySize = 16;
            const entriesSize = entrySize * this.selectedSizes.length;
            let dataOffset = headerSize + entriesSize;

            // Build ICO file
            const parts: ArrayBuffer[] = [];

            // Add header
            parts.push(this.createIcoHeader(this.selectedSizes.length));

            // Add directory entries
            for (let i = 0; i < this.selectedSizes.length; i++) {
                const size = this.selectedSizes[i];
                const pngData = pngDataList[i];

                parts.push(this.createIcoEntry(size, size, pngData.byteLength, dataOffset));
                dataOffset += pngData.byteLength;
            }

            // Add image data
            parts.push(...pngDataList);

            // Combine all parts
            const totalSize = parts.reduce((sum, buf) => sum + buf.byteLength, 0);
            const icoBuffer = new Uint8Array(totalSize);
            let offset = 0;

            for (const part of parts) {
                icoBuffer.set(new Uint8Array(part), offset);
                offset += part.byteLength;
            }

            // Download
            const blob = new Blob([icoBuffer], { type: 'image/x-icon' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = this.file.name.replace(/\.[^/.]+$/, '.ico');
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (error) {
            console.error('Conversion failed:', error);
        } finally {
            this.isConverting = false;
        }
    }

    private loadImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = reader.result as string;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    private renderPreview() {
        if (!this.previewUrl) {
            return '';
        }

        return html`
            <div class="p-4 bg-gray-100 rounded">
                <p class="text-sm text-gray-600 mb-2">Preview:</p>
                <img src="${this.previewUrl}" alt="Preview" class="max-w-full h-auto max-h-48 rounded" />
            </div>
        `;
    }

    private handleSizeChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const size = parseInt(input.dataset.size || '0', 10);

        if (size > 0) {
            this.toggleSize(size);
        }
    }

    private renderSizeCheckboxes() {
        return ICO_SIZES.map(size => html`
            <label class="inline-flex items-center gap-1 cursor-pointer">
                <input
                    type="checkbox"
                    class="form-checkbox"
                    data-size="${size}"
                    ?checked="${this.selectedSizes.includes(size)}"
                    @change="${this.handleSizeChange}"
                />
                <span>${size}x${size}</span>
            </label>
        `);
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2">Select an image (JPEG, PNG, etc.):</label>
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                        class="form-input" @change="${this.handleFileChange}" />
                </div>
                ${this.renderPreview()}
                <div>
                    <label class="block mb-2">Select ICO sizes (pixels):</label>
                    <div class="flex flex-wrap gap-2">${this.renderSizeCheckboxes()}</div>
                </div>
                <button class="btn btn-blue" @click="${this.convert}"
                    ?disabled="${!this.file || this.selectedSizes.length === 0 || this.isConverting}">
                    ${this.isConverting ? 'Converting...' : 'Convert to ICO'}
                </button>
                <div class="p-4 bg-blue-50 rounded border border-blue-200">
                    <p class="text-sm text-blue-800">
                        <strong>Tip:</strong> ICO files can contain multiple sizes. 
                        For favicons, 16x16 and 32x32 are commonly used.
                    </p>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'image-to-ico-converter': ImageToIcoConverter;
    }
}
