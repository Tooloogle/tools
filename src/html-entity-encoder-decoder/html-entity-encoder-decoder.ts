import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlEntityEncoderDecoderStyles from './html-entity-encoder-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';
import '../t-button/t-button.js';
import '../t-textarea/t-textarea.js';

@customElement('html-entity-encoder-decoder')
export class HtmlEntityEncoderDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, htmlEntityEncoderDecoderStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
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
                <t-textarea placeholder="Enter text to encode or decode..." rows="6" .value=${String(this.input)} @t-input=${this.handleInputChange}></t-textarea>
            </label>

            <div class="py-2 text-right">
                <t-button variant="blue" @click=${this.encode}>Encode</t-button>
                <t-button variant="green" @click=${this.decode}>Decode</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1">Output:</span>
                    <t-textarea rows="6" .value=${String(this.output)} ?readonly=${true}></t-textarea>
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
