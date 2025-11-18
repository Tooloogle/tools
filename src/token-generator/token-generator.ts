import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tokenGeneratorStyles from './token-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-copy-button/t-copy-button.js';

@customElement('token-generator')
export class TokenGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, tokenGeneratorStyles];

    @property()
    length = 32;

    @property()
    useHex = true;

    @property()
    useBase64 = false;

    @property()
    useAlphanumeric = false;

    @property()
    tokens: string[] = [];

    @property()
    count = 1;

    private handleLengthChange(e: Event) {
        this.length = parseInt((e.target as HTMLInputElement).value) || 32;
    }

    private handleCountChange(e: Event) {
        this.count = parseInt((e.target as HTMLInputElement).value) || 1;
    }

    private handleFormatChange(e: Event) {
        const format = (e.target as HTMLSelectElement).value;
        this.useHex = format === 'hex';
        this.useBase64 = format === 'base64';
        this.useAlphanumeric = format === 'alphanumeric';
    }

    private generateHexToken(length: number): string {
        const bytes = new Uint8Array(Math.ceil(length / 2));
        crypto.getRandomValues(bytes);
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, length);
    }

    private generateBase64Token(length: number): string {
        const bytes = new Uint8Array(Math.ceil(length * 3 / 4));
        crypto.getRandomValues(bytes);
        return btoa(String.fromCharCode(...bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '')
            .slice(0, length);
    }

    private generateAlphanumericToken(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const bytes = new Uint8Array(length);
        crypto.getRandomValues(bytes);
        return Array.from(bytes).map(b => chars[b % chars.length]).join('');
    }

    private generateTokens() {
        this.tokens = [];
        
        for (let i = 0; i < this.count; i++) {
            let token = '';
            if (this.useHex) {
                token = this.generateHexToken(this.length);
            } else if (this.useBase64) {
                token = this.generateBase64Token(this.length);
            } else if (this.useAlphanumeric) {
                token = this.generateAlphanumericToken(this.length);
            }

            this.tokens.push(token);
        }
    }

    private copyAll() {
        if (!isBrowser()) return;
        void navigator.clipboard.writeText(this.tokens.join('\n'));
    }

    private clear() {
        this.tokens = [];
    }

    private renderTokenInput(token: string) {
        return html`
            <div class="flex gap-2 items-center">
                <input
                    type="text"
                    class="form-input font-mono text-sm"
                    readonly
                    .value=${token}
                />
                <t-copy-button .isIcon=${false} .text=${token}></t-copy-button>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="space-y-4 py-2">
                <div class="grid grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Token Length:</span>
                        <input
                            type="number"
                            class="form-input"
                            min="8"
                            max="256"
                            .value=${String(this.length)}
                            @input=${this.handleLengthChange}
                        />
                    </label>

                    <label class="block">
                        <span class="inline-block py-1 font-bold">Number of Tokens:</span>
                        <input
                            type="number"
                            class="form-input"
                            min="1"
                            max="50"
                            .value=${String(this.count)}
                            @input=${this.handleCountChange}
                        />
                    </label>
                </div>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Format:</span>
                    <select
                        class="form-select"
                        .value=${this.useHex ? 'hex' : this.useBase64 ? 'base64' : 'alphanumeric'}
                        @change=${this.handleFormatChange}
                    >
                        <option value="hex">Hexadecimal</option>
                        <option value="base64">Base64 URL-Safe</option>
                        <option value="alphanumeric">Alphanumeric</option>
                    </select>
                </label>

                <div class="flex gap-2">
                    <button class="btn btn-blue" @click=${this.generateTokens}>Generate Tokens</button>
                    ${this.tokens.length > 0 ? html`
                        <button class="btn btn-blue" @click=${this.copyAll}>Copy All</button>
                        <button class="btn btn-red" @click=${this.clear}>Clear</button>
                    ` : ''}
                </div>

                ${this.tokens.length > 0 ? html`
                    <div class="space-y-2">
                        <h3 class="font-bold">Generated Tokens:</h3>
                        ${this.tokens.map(token => this.renderTokenInput(token))}
                    </div>
                ` : ''}

                <div class="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
                    <p class="font-bold">🔐 Security Note:</p>
                    <p class="mt-1">These tokens are generated using cryptographically secure random values. Use them for API keys, session tokens, or other security-sensitive purposes.</p>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'token-generator': TokenGenerator;
    }
}
