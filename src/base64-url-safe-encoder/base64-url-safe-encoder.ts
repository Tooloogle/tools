import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import base64UrlSafeEncoderStyles from './base64-url-safe-encoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('base64-url-safe-encoder')
export class Base64UrlSafeEncoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, base64UrlSafeEncoderStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    mode: 'encode' | 'decode' = 'encode';

    @property()
    error = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
        this.error = '';
    }

    private encode() {
        this.mode = 'encode';
        this.error = '';
        try {
            const base64 = btoa(this.input);
            this.output = base64
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        } catch (e) {
            this.error = `Error encoding: ${  (e as Error).message}`;
            this.output = '';
        }
    }

    private decode() {
        this.mode = 'decode';
        this.error = '';
        try {
            let base64 = this.input
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            
            const padding = base64.length % 4;
            if (padding) {
                base64 += '='.repeat(4 - padding);
            }
            
            this.output = atob(base64);
        } catch (e) {
            this.error = `Error decoding: ${  (e as Error).message}`;
            this.output = '';
        }
    }

    private clear() {
        this.input = '';
        this.output = '';
        this.error = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input:</span>
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to encode or Base64 URL-safe string to decode..."
                    rows="6"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.encode}>Encode</button>
                <button class="btn btn-blue" @click=${this.decode}>Decode</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.error ? html`
                <div class="py-2">
                    <div class="px-3 py-2 bg-red-100 text-red-800 rounded">
                        ${this.error}
                    </div>
                </div>
            ` : ''}

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <textarea
                        class="form-textarea"
                        rows="6"
                        readonly
                        .value=${this.output}
                    ></textarea>
                    <div class="py-2 text-right">
                        <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
                    </div>
                </label>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'base64-url-safe-encoder': Base64UrlSafeEncoder;
    }
}
