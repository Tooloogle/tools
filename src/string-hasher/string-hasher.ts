import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import stringHasherStyles from './string-hasher.css.js';
import { customElement, property } from 'lit/decorators.js';
import md5 from 'blueimp-md5';
import '../t-copy-button';
import '../t-button';
import '../t-textarea';
import '../t-input';

@customElement('string-hasher')
export class StringHasher extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, stringHasherStyles];

    @property()
    input = '';

    @property()
    md5Hash = '';

    @property()
    sha1Hash = '';

    @property()
    sha256Hash = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
        // Auto-generate hashes on input change
        if (this.input) {
            void this.generateHashes();
        } else {
            this.md5Hash = '';
            this.sha1Hash = '';
            this.sha256Hash = '';
        }
    }

    private async generateHashes() {
        this.md5Hash = md5(this.input);

        const encoder = new TextEncoder();
        const data = encoder.encode(this.input);

        try {
            const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
            this.sha1Hash = Array.from(new Uint8Array(sha1Buffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
            this.sha256Hash = Array.from(new Uint8Array(sha256Buffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        } catch (e) {
            console.error('Error generating hashes:', e);
        }
    }

    private clear() {
        this.input = '';
        this.md5Hash = '';
        this.sha1Hash = '';
        this.sha256Hash = '';
    }

    // TODO: Refactor render method to be under 50 lines by extracting sub-components
    // eslint-disable-next-line max-lines-per-function
    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input Text:</span>
                <t-textarea placeholder="Enter text to hash..." rows="6" .value=${String(this.input)} @t-input=${this.handleInputChange}></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.md5Hash ? html`
                <div class="space-y-3 py-2">
                    <div>
                        <label class="block">
                            <span class="inline-block py-1 font-bold">MD5:</span>
                            <div class="flex gap-2">
                                <t-input ?readonly=${true} class="font-mono text-sm"></t-input>
                                <t-copy-button .isIcon=${false} .text=${this.md5Hash}></t-copy-button>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label class="block">
                            <span class="inline-block py-1 font-bold">SHA-1:</span>
                            <div class="flex gap-2">
                                <t-input ?readonly=${true} class="font-mono text-sm"></t-input>
                                <t-copy-button .isIcon=${false} .text=${this.sha1Hash}></t-copy-button>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label class="block">
                            <span class="inline-block py-1 font-bold">SHA-256:</span>
                            <div class="flex gap-2">
                                <t-input ?readonly=${true} class="font-mono text-sm"></t-input>
                                <t-copy-button .isIcon=${false} .text=${this.sha256Hash}></t-copy-button>
                            </div>
                        </label>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'string-hasher': StringHasher;
    }
}
