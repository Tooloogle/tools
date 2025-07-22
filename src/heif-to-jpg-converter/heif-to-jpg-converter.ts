import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import heifToJpgConverterStyles from './heif-to-jpg-converter.css.js';
import { customElement,property } from 'lit/decorators.js';

// heic2any is loaded via CDN - add this to your HTML:
declare const heic2any: any;
@customElement('heif-to-jpg-converter')
export class HeifToJpgConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, heifToJpgConverterStyles];

    @property({ type: Object }) file: File | null = null;
    @property({ type: Boolean }) converting= false;
    @property({ type: String }) error = '';

    private handleFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.file = input.files?.[0] ?? null;
        this.error = '';
    }

    private async convert() {
        if (!this.file) return;
        
        this.converting = true;
        this.error = '';

        try {
            if (typeof heic2any === 'undefined') {
                throw new Error('heic2any library not loaded. Please include the CDN script.');
            }

            // Convert HEIF to JPEG
            const convertedBlob = await heic2any({
                blob: this.file,
                toType: 'image/jpeg',
                quality: 0.9
            });

            const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            
            // Create download link
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            const fileName = this.file.name.replace(/\.(heic|heif)$/i, '.jpg');
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(a.href);
            
        } catch (error) {
            console.error('Conversion failed:', error);
            this.error = error instanceof Error ? error.message : 'Failed to convert HEIF file. Please try another file.';
        } finally {
            this.converting = false;
            
        }
    }

    override render() {
        return html`
            <div class="container">
                <label>Select a HEIF file:</label>
                <input 
                    type="file" 
                    accept="image/heif,.heif" 
                    class="form-input" 
                    @change="${this.handleFileChange}" 
                />
                
                ${this.error ? html`
                    <div class="error-message" style="color: red; margin: 10px 0;">
                        ${this.error}
                    </div>
                ` : ''}
                
               
                
                <button 
                    class="btn" 
                    @click="${this.convert}" 
                    ?disabled="${!this.file || this.converting}"
                >
                    ${this.converting ? `Converting...` : 'Convert to JPG'}
                </button>
                
                <ul class="info">
                    <li>Supports HEIF files from various devices</li>
                    <li>Conversion happens entirely in your browser - no uploads</li>
                    <li>Converted file downloads automatically</li>
                </ul>
            </div>
        `;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'heif-to-jpg-converter': HeifToJpgConverter;
    }
}
