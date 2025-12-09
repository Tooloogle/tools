import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jwtDecoderStyles from './jwt-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-textarea/t-textarea.js';
import '../t-button/t-button.js';

@customElement('jwt-decoder')
export class JwtDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jwtDecoderStyles];

    @property()
    input = '';

    @property()
    header = '';

    @property()
    payload = '';

    @property()
    error = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
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

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">JWT Token:</span>
                <t-textarea
                    placeholder="Paste JWT token here..."
                    rows="4"
                    .value=${this.input}
                    @t-input=${this.handleInputChange}
                ></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.decodeJwt}>Decode JWT</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
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
                        <t-textarea
                            class="font-mono text-sm"
                            rows="6"
                            ?readonly=${true}
                            .value=${this.header}
                        ></t-textarea>
                    </label>
                </div>
            ` : ''}

            ${this.payload ? html`
                <div class="py-1">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Payload:</span>
                        <t-textarea
                            class="font-mono text-sm"
                            rows="10"
                            ?readonly=${true}
                            .value=${this.payload}
                        ></t-textarea>
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
