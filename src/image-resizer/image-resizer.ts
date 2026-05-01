import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageResizerStyles from './image-resizer.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';
import {
    EXT,
    formatBytes,
    readDimensions,
    renderToBlob,
    type OutputFormat,
} from './image-resizer-utils.js';
import {
    renderFormatRow,
    renderModeToggle,
    renderPercentInput,
    renderPixelInputs,
} from './image-resizer-templates.js';

export type ResizeMode = 'pixels' | 'percent';

@customElement('image-resizer')
export class ImageResizer extends WebComponentBase {
    static override styles = [WebComponentBase.styles, imageResizerStyles];

    @state() file: File | null = null;
    @state() originalWidth = 0;
    @state() originalHeight = 0;
    @state() targetWidth = 0;
    @state() targetHeight = 0;
    @state() lockAspect = true;
    @state() mode: ResizeMode = 'pixels';
    @state() scalePercent = 100;
    @state() outputFormat: OutputFormat = 'image/png';
    @state() quality = 0.92;
    @state() previewUrl = '';
    @state() outputBlobUrl = '';
    @state() outputSize = 0;
    @state() errorMsg = '';

    @property({ type: Number }) maxScalePercent = 500;

    private clearSelectedFileState() {
        this.revokePreview();
        this.resetOutput();
        this.file = null;
        this.originalWidth = 0;
        this.originalHeight = 0;
        this.targetWidth = 0;
        this.targetHeight = 0;
        this.scalePercent = 100;
    }

    onFileChange = async (e: CustomEvent<TFileDropzoneChangeDetail>) => {
        const file = e.detail.file;
        if (!file) {
            this.clearSelectedFileState();
            return;
        }

        this.resetOutput();
        this.file = file;
        this.revokePreview();
        this.previewUrl = URL.createObjectURL(file);
        try {
            const dims = await readDimensions(file);
            this.originalWidth = dims.width;
            this.originalHeight = dims.height;
            this.targetWidth = dims.width;
            this.targetHeight = dims.height;
            this.scalePercent = 100;
        } catch {
            this.clearSelectedFileState();
            this.errorMsg = 'Could not read image dimensions.';
        }
    };

    onWidthInput = (e: Event) => {
        const val = Math.max(1, Number((e.target as HTMLInputElement).value) || 0);
        this.targetWidth = val;
        if (this.lockAspect && this.originalWidth > 0) {
            this.targetHeight = Math.max(1, Math.round(val * (this.originalHeight / this.originalWidth)));
        }
    };

    onHeightInput = (e: Event) => {
        const val = Math.max(1, Number((e.target as HTMLInputElement).value) || 0);
        this.targetHeight = val;
        if (this.lockAspect && this.originalHeight > 0) {
            this.targetWidth = Math.max(1, Math.round(val * (this.originalWidth / this.originalHeight)));
        }
    };

    onPercentInput = (e: Event) => {
        const val = Math.max(1, Math.min(this.maxScalePercent, Number((e.target as HTMLInputElement).value) || 1));
        this.scalePercent = val;
    };

    onLockToggle = (e: Event) => {
        this.lockAspect = (e.target as HTMLInputElement).checked;
    };

    onModeChange = (e: Event) => {
        this.mode = (e.target as HTMLInputElement).value as ResizeMode;
    };

    onFormatChange = (e: Event) => {
        this.outputFormat = (e.target as HTMLSelectElement).value as OutputFormat;
    };

    onQualityChange = (e: Event) => {
        this.quality = Number((e.target as HTMLInputElement).value);
    };

    private computeTarget() {
        if (this.mode === 'percent') {
            return {
                width: Math.max(1, Math.round((this.originalWidth * this.scalePercent) / 100)),
                height: Math.max(1, Math.round((this.originalHeight * this.scalePercent) / 100)),
            };
        }

        return {
            width: Math.max(1, Math.round(this.targetWidth)),
            height: Math.max(1, Math.round(this.targetHeight)),
        };
    }

    resize = async () => {
        if (!this.file) {
            return;
        }

        const { width, height } = this.computeTarget();
        try {
            const useQuality = this.outputFormat !== 'image/png';
            const blob = await renderToBlob(this.file, width, height, this.outputFormat, this.quality, useQuality);
            this.revokeOutput();
            this.outputBlobUrl = URL.createObjectURL(blob);
            this.outputSize = blob.size;
            this.errorMsg = '';
        } catch (err) {
            this.errorMsg = err instanceof Error ? err.message : 'Resize failed.';
        }
    };

    private downloadFileName(): string {
        const base = this.file?.name.replace(/\.[^/.]+$/, '') ?? 'image';
        const { width, height } = this.computeTarget();
        return `${base}-${width}x${height}.${EXT[this.outputFormat]}`;
    }

    private revokePreview() {
        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
            this.previewUrl = '';
        }
    }

    private revokeOutput() {
        if (this.outputBlobUrl) {
            URL.revokeObjectURL(this.outputBlobUrl);
            this.outputBlobUrl = '';
        }
    }

    private resetOutput() {
        this.revokeOutput();
        this.outputSize = 0;
        this.errorMsg = '';
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.revokePreview();
        this.revokeOutput();
    }

    private renderControls() {
        return html`
            ${renderModeToggle(this)}
            ${this.mode === 'pixels' ? renderPixelInputs(this) : renderPercentInput(this)}
            ${renderFormatRow(this)}
            <button class="btn btn-blue" @click=${this.resize}>Resize image</button>
        `;
    }

    private renderOutput() {
        return html`
            <div>
                <img class="preview-img" src=${this.outputBlobUrl} alt="Resized output" />
                <div class="stat-row">
                    <span>Output size: <strong>${formatBytes(this.outputSize)}</strong></span>
                    <a class="btn btn-green" href=${this.outputBlobUrl} download=${this.downloadFileName()}>
                        Download
                    </a>
                </div>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="space-y-3">
                <t-file-dropzone
                    accept="image/*"
                    label="Drop an image here or click to browse"
                    hint="PNG, JPG, WebP, GIF, etc."
                    @change=${this.onFileChange}
                ></t-file-dropzone>
                ${when(this.previewUrl, () => html`<img class="preview-img" src=${this.previewUrl} alt="Selected image preview" />`)}
                ${when(this.file, () => this.renderControls())}
                ${when(this.errorMsg, () => html`<div class="text-sm text-red-600">${this.errorMsg}</div>`)}
                ${when(this.outputBlobUrl, () => this.renderOutput())}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'image-resizer': ImageResizer;
    }
}
