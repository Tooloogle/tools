import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageCompressorStyles from './image-compressor.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import '../t-file-dropzone/index.js';
import type { TFileDropzoneChangeDetail } from '../t-file-dropzone/t-file-dropzone.js';
import {
    EXT,
    encode,
    searchTargetSize,
    type OutputFormat,
} from './image-compressor-utils.js';
import {
    renderFormatSelect,
    renderModeToggle,
    renderQualityControl,
    renderStats,
    renderTargetSizeControl,
} from './image-compressor-templates.js';

export type CompressMode = 'quality' | 'targetSize';

@customElement('image-compressor')
export class ImageCompressor extends WebComponentBase {
    static override styles = [WebComponentBase.styles, imageCompressorStyles];

    @state() file: File | null = null;
    @state() originalSize = 0;
    @state() quality = 0.8;
    @state() outputFormat: OutputFormat = 'image/jpeg';
    @state() mode: CompressMode = 'quality';
    @state() targetSizeKB = 200;
    @state() outputBlobUrl = '';
    @state() outputSize = 0;
    @state() effectiveQuality = 0;
    @state() previewUrl = '';
    @state() errorMsg = '';
    @state() busy = false;

    @property({ type: Number }) debounceMs = 150;

    private debounceTimer?: number;
    private runId = 0;

    private clearSelectedFileState() {
        this.runId++;
        this.revokePreview();
        this.resetOutput();
        this.file = null;
        this.originalSize = 0;
        this.busy = false;
    }

    onFileChange = async (e: CustomEvent<TFileDropzoneChangeDetail>) => {
        const file = e.detail.file;
        if (!file) {
            this.clearSelectedFileState();
            return;
        }

        this.resetOutput();
        this.file = file;
        this.originalSize = file.size;
        this.revokePreview();
        this.previewUrl = URL.createObjectURL(file);
        await this.compress();
    };

    onModeChange = (e: Event) => {
        const next = (e.target as HTMLInputElement).value as CompressMode;
        if (this.mode === next) {
            return;
        }

        this.mode = next;
        if (!this.file) {
            return;
        }

        if (next === 'quality') {
            this.scheduleCompress();
        } else {
            // Stale stats from a previous quality-mode run shouldn't linger
            // until the user clicks "Compress to target size".
            this.resetOutput();
        }
    };

    onFormatChange = (e: Event) => {
        this.outputFormat = (e.target as HTMLSelectElement).value as OutputFormat;
        this.scheduleCompress();
    };

    onQualityInput = (e: Event) => {
        this.quality = Number((e.target as HTMLInputElement).value);
        this.scheduleCompress();
    };

    onTargetSizeInput = (e: Event) => {
        this.targetSizeKB = Math.max(1, Number((e.target as HTMLInputElement).value) || 1);
    };

    private scheduleCompress() {
        if (!this.file || this.mode !== 'quality') {
            return;
        }

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = window.setTimeout(() => {
            void this.compress();
        }, this.debounceMs);
    }

    compress = async () => {
        if (!this.file) {
            return;
        }

        const myRun = ++this.runId;
        this.busy = true;
        try {
            let blob: Blob;
            let quality: number;
            if (this.mode === 'quality') {
                blob = await encode(this.file, this.outputFormat, this.quality);
                quality = this.quality;
            } else {
                const result = await searchTargetSize(this.file, this.outputFormat, this.targetSizeKB * 1024);
                blob = result.blob;
                quality = result.quality;
            }

            // A newer run started while we were encoding; discard this result.
            if (myRun !== this.runId) {
                return;
            }

            this.commitOutput(blob, quality);
            this.errorMsg = '';
        } catch (err) {
            if (myRun !== this.runId) {
                return;
            }

            this.errorMsg = err instanceof Error ? err.message : 'Compression failed.';
        } finally {
            if (myRun === this.runId) {
                this.busy = false;
            }
        }
    };

    private commitOutput(blob: Blob, quality: number) {
        this.revokeOutput();
        this.outputBlobUrl = URL.createObjectURL(blob);
        this.outputSize = blob.size;
        this.effectiveQuality = quality;
    }

    get savingsPercent(): number {
        if (!this.originalSize) {
            return 0;
        }

        return ((this.originalSize - this.outputSize) / this.originalSize) * 100;
    }

    get downloadFileName(): string {
        const base = this.file?.name.replace(/\.[^/.]+$/, '') ?? 'image';
        return `${base}-compressed.${EXT[this.outputFormat]}`;
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
        this.effectiveQuality = 0;
        this.errorMsg = '';
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.revokePreview();
        this.revokeOutput();
    }

    private renderControls() {
        return html`
            ${renderModeToggle(this)}
            ${renderFormatSelect(this)}
            ${this.mode === 'quality' ? renderQualityControl(this) : renderTargetSizeControl(this)}
        `;
    }

    override render() {
        return html`
            <div class="space-y-3">
                <t-file-dropzone
                    accept="image/*"
                    label="Drop an image here or click to browse"
                    hint="JPG, PNG, WebP, etc. (output: JPG or WebP)"
                    @change=${this.onFileChange}
                ></t-file-dropzone>
                ${when(this.previewUrl, () => html`<img class="preview-img" src=${this.previewUrl} alt="Selected image preview" />`)}
                ${when(this.file, () => this.renderControls())}
                ${when(this.errorMsg, () => html`<div class="text-sm text-red-600">${this.errorMsg}</div>`)}
                ${when(this.outputBlobUrl, () => renderStats(this))}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'image-compressor': ImageCompressor;
    }
}
