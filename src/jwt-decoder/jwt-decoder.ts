import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jwtDecoderStyles from './jwt-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('jwt-decoder')
export class JwtDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, jwtDecoderStyles];

    @property()
    input = '';

    @property()
    header = '';

    @property()
    payload = '';

    @property()
    error = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private decodeJwt() {
        this.error = '';
        this.header = '';
        this.payload = '';

        try {
            const parts = this.input.trim().split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
            }

            const decodeBase64Url = (str: string) => {
                let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
                const padding = base64.length % 4;
                if (padding) {
                    base64 += '='.repeat(4 - padding);
                }

                return atob(base64);
            };

            const headerJson = decodeBase64Url(parts[0]);
            const payloadJson = decodeBase64Url(parts[1]);

            this.header = JSON.stringify(JSON.parse(headerJson), null, 2);
            this.payload = JSON.stringify(JSON.parse(payloadJson), null, 2);
        } catch (e) {
            this.error = `Error decoding JWT: ${  (e as Error).message}`;
        }
    }

    private clear() {
        this.input = '';
        this.header = '';
        this.payload = '';
        this.error = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">JWT Token:</span>
                <textarea
                    class="form-textarea"
                    placeholder="Paste JWT token here..."
                    rows="4"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.decodeJwt}>Decode JWT</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.error ? html`
                <div class="py-2">
                    <div class="px-3 py-2 bg-red-100 text-red-800 rounded">
                        ${this.error}
                    </div>
                </div>
            ` : ''}

            ${this.header ? html`
                <div class="py-1">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Header:</span>
                        <textarea
                            class="form-textarea font-mono text-sm"
                            rows="6"
                            readonly
                            .value=${this.header}
                        ></textarea>
                    </label>
                </div>
            ` : ''}

            ${this.payload ? html`
                <div class="py-1">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Payload:</span>
                        <textarea
                            class="form-textarea font-mono text-sm"
                            rows="10"
                            readonly
                            .value=${this.payload}
                        ></textarea>
                    </label>
                </div>

                <div class="mt-2 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
                    <strong>⚠️ Warning:</strong> This tool only decodes the JWT. It does NOT verify the signature.
                    Never trust decoded JWT data without proper signature verification on your backend.
                </div>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jwt-decoder': JwtDecoder;
    }
}
