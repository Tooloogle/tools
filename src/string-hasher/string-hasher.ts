import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import stringHasherStyles from './string-hasher.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import md5 from 'blueimp-md5';
import '../t-copy-button/t-copy-button.js';

@customElement('string-hasher')
export class StringHasher extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, stringHasherStyles];

    @property()
    input = '';

    @property()
    md5Hash = '';

    @property()
    sha1Hash = '';

    @property()
    sha256Hash = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
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

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input Text:</span>
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to hash..."
                    rows="6"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.generateHashes}>Generate Hashes</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.md5Hash ? html`
                <div class="space-y-3 py-2">
                    <div>
                        <label class="block">
                            <span class="inline-block py-1 font-bold">MD5:</span>
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    class="form-input font-mono text-sm"
                                    readonly
                                    .value=${this.md5Hash}
                                />
                                <t-copy-button .isIcon=${false} .text=${this.md5Hash}></t-copy-button>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label class="block">
                            <span class="inline-block py-1 font-bold">SHA-1:</span>
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    class="form-input font-mono text-sm"
                                    readonly
                                    .value=${this.sha1Hash}
                                />
                                <t-copy-button .isIcon=${false} .text=${this.sha1Hash}></t-copy-button>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label class="block">
                            <span class="inline-block py-1 font-bold">SHA-256:</span>
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    class="form-input font-mono text-sm"
                                    readonly
                                    .value=${this.sha256Hash}
                                />
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
