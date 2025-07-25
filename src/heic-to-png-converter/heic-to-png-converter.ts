import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import heicToPngConverterStyles from './heic-to-png-converter.css.js';
import { customElement, state } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

interface Heic2Any {
    (options: {
        blob: Blob;
        toType: 'image/jpeg' | 'image/png';
        quality?: number;
    }): Promise<Blob | Blob[]>;
}

declare global {
    interface Window {
        heic2any: Heic2Any;
    }
}

@customElement('heic-to-png-converter')
export class HeicToPngConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, heicToPngConverterStyles];

    @state() file: File | null = null;
    @state() converting = false;
    @state() error = '';
    @state() libLoaded = false;

    override async connectedCallback() {
        super.connectedCallback();
        await this.loadLibrary();
    }

    private async loadLibrary(): Promise<void> {
        if (typeof window.heic2any !== 'undefined') {
            this.libLoaded = true;
            return;
        }

        try {
            await this.loadScript('/src/_libs/heic-heif-to-jpg-png/heic2any.js');
            if (typeof window.heic2any === 'undefined') {
                throw new Error('Library not initialized');
            }

            this.libLoaded = true;
        } catch (err) {
            console.error('Library load failed:', err);
            this.error = 'Failed to load converter. Please refresh.';
        }
    }

    private loadScript(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = () => setTimeout(resolve, 100);
            script.onerror = () => reject(new Error(`Script load failed: ${src}`));
            document.head.appendChild(script);
        });
    }

    private handleFileChange(e: Event): void {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        if (file && !file.name.match(/\.(heic|heif)$/i)) {
            this.error = 'Only HEIC/HEIF files are supported';
            this.file = null;
            return;
        }

        this.file = file;
        this.error = '';
    }

    private async convert(): Promise<void> {
        if (!this.file || !this.libLoaded) return;

        this.converting = true;
        this.error = '';

        try {
            const result = await window.heic2any({
                blob: this.file,
                toType: 'image/png',
                quality: 1.0
            });

            const blob = Array.isArray(result) ? result[0] : result;
            this.downloadImage(blob);
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Conversion failed';
            console.error('Conversion error:', err);
        } finally {
            this.converting = false;
        }
    }

    private downloadImage(blob: Blob): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.getConvertedFilename();
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    private getConvertedFilename(): string {
        if (!this.file) return 'converted.png';
        return this.file.name.replace(/\.(heic|heif)$/i, '.png');
    }

    override render() {
        return html`
            <div class="space-y-3">
                <label>Select HEIC file:</label>
                <input
                    type="file"
                    accept=".heic,image/heic"
                    class="form-input"
                    @change=${this.handleFileChange}
                    ?disabled=${!this.libLoaded}
                />
                
                ${this.error ? html`<div class="text-rose-500">${this.error}</div>` : ''}
                ${!this.libLoaded ? html`<div class="text-amber-500">Loading converter...</div>` : ''}
                
                <button
                    class="btn btn-blue"
                    @click=${this.convert}
                    ?disabled=${!this.file || this.converting || !this.libLoaded}
                >
                    ${this.converting ? 'Converting...' : 'Convert to PNG'}
                </button>
                
                <ul class="list-disc pl-5 text-sm">
                    <li>Supports HEIC files (iPhone, iPad, etc.)</li>
                    <li>100% browser-based - no server upload</li>
                    <li>Preserves transparency in PNG output</li>
                </ul>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'heic-to-png-converter': HeicToPngConverter;
    }
}