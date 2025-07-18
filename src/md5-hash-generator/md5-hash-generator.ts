import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import md5HashGeneratorStyles from './md5-hash-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import buttonStyles from '../_styles/button.css.js';
import inputStyles from "../_styles/input.css.js";

// Declare md5 function from CDN
declare const md5: (input: string) => string;

@customElement('md5-hash-generator')
export class Md5HashGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, md5HashGeneratorStyles];

    @property()
    input = "";

    @property()
    hash = "";

    @property({ type: Boolean })
    processing = false;

    private onInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private calculateMD5(text: string): string {
        // Remove .toString() as CDN version already returns string
        return md5(text);
    }

    async generateHash() {
        if (!this.input.trim()) return;

        this.processing = true;
        try {
            this.hash = this.calculateMD5(this.input);
        } catch (err) {
            console.error('MD5 hashing failed:', err);
            this.hash = 'Error generating hash';
        } finally {
            this.processing = false;
        }
    }

    copyHash() {
        if (this.hash) {
            navigator.clipboard.writeText(this.hash);
        }
    }

    clearAll() {
        this.input = '';
        this.hash = '';
    }

    override render() {
        return html`
        <div class="container">
            <label class="block">
                <span class="inline-block py-1">Input Text</span>
                <textarea
                    class="form-textarea"
                    autofocus
                    placeholder="Enter text to generate MD5 hash"
                    rows="5"
                    .value=${this.input}
                    @input=${this.onInputChange}></textarea>
            </label>
            
            <div class="button-group">
                <button class="btn" @click=${this.generateHash} ?disabled=${!this.input || this.processing}>
                    ${this.processing ? 'Generating...' : 'Generate MD5 Hash'}
                </button>
                <button class="btn secondary" @click=${this.clearAll}>
                    Clear All
                </button>
            </div>

            ${this.hash ? html`
                <label class="block">
                    <span class="inline-block py-1">MD5 Hash</span>
                    <textarea
                        class="form-textarea"
                        rows="1"
                        readonly
                        .value=${this.hash}></textarea>
                </label>
                
                <div class="button-group">
                    <button class="btn secondary" @click=${this.copyHash}>
                        Copy Hash
                    </button>
                </div>

                <div class="info">
                    <p><strong>Note:</strong> MD5 is a one-way cryptographic hash function. Always produces a 32-character hexadecimal hash (0-9, a-f) 
                    The same input will always produce the same hash, but the original text cannot be recovered from the hash.</p>
                </div>
            ` : ''}
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'md5-hash-generator': Md5HashGenerator;
    }
}