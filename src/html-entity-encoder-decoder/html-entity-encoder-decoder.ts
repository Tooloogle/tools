import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlEntityEncoderDecoderStyles from './html-entity-encoder-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('html-entity-encoder-decoder')
export class HtmlEntityEncoderDecoder extends WebComponentBase {
    static override styles = [WebComponentBase.styles, htmlEntityEncoderDecoderStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private encode() {
        const textarea = document.createElement('textarea');
        textarea.textContent = this.input;
        this.output = textarea.innerHTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    private decode() {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = this.input;
        this.output = textarea.value;
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1">Input Text:</span>
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to encode or decode..."
                    rows="6"
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 text-right">
                <button class="btn btn-blue" @click=${this.encode}>Encode</button>
                <button class="btn btn-green" @click=${this.decode}>Decode</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1">Output:</span>
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
        'html-entity-encoder-decoder': HtmlEntityEncoderDecoder;
    }
}
