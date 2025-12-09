import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tokenGeneratorStyles from './token-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-copy-button';
import '../t-button';
import '../t-input';
import '../t-select';

@customElement('token-generator')
export class TokenGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, tokenGeneratorStyles];

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

    private handleLengthChange(e: CustomEvent) {
        this.length = parseInt(e.detail.value) || 32;
    }

    private handleCountChange(e: CustomEvent) {
        this.count = parseInt(e.detail.value) || 1;
    }

    private handleFormatChange(e: CustomEvent) {
        const format = e.detail.value;
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
        if (!isBrowser()) {
            return;
        }

        void navigator.clipboard.writeText(this.tokens.join('\n'));
    }

    private clear() {
        this.tokens = [];
    }

    private renderTokenInput(token: string) {
        return html`
            <div class="flex gap-2 items-center">
                <t-input ?readonly=${true} class="font-mono text-sm"></t-input>
                <t-copy-button .isIcon=${false} .text=${token}></t-copy-button>
            </div>
        `;
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <div class="space-y-4 py-2">
                <div class="grid grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1 font-bold">Token Length:</span>
                        <t-input type="number"></t-input>
                    </label>

                    <label class="block">
                        <span class="inline-block py-1 font-bold">Number of Tokens:</span>
                        <t-input type="number"></t-input>
                    </label>
                </div>

                <label class="block">
                    <span class="inline-block py-1 font-bold">Format:</span>
                    <t-select .value=${String(this.useHex ? 'hex' : this.useBase64 ? 'base64' : 'alphanumeric')} @t-change=${this.handleFormatChange}>
                        <option value="hex">Hexadecimal</option>
                        <option value="base64">Base64 URL-Safe</option>
                        <option value="alphanumeric">Alphanumeric</option>
                    </t-select>
                </label>

                <div class="flex gap-2">
                    <t-button variant="blue" @click=${this.generateTokens}>Generate Tokens</t-button>
                    ${this.tokens.length > 0 ? html`
                        <t-button variant="blue" @click=${this.copyAll}>Copy All</t-button>
                        <t-button variant="red" @click=${this.clear}>Clear</t-button>
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
