import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlEncoderDecoderStyles from './html-encoder-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-copy-button';
import '../t-button';
import '../t-textarea';

@customElement('html-encoder-decoder')
export class HtmlEncoderDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, htmlEncoderDecoderStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
    }

    private encode() {
        if (!isBrowser()) {
            return;
        }

        const div = document.createElement('div');
        div.textContent = this.input;
        this.output = div.innerHTML;
    }

    private decode() {
        if (!isBrowser()) {
            return;
        }

        const div = document.createElement('div');
        div.innerHTML = this.input;
        this.output = div.textContent || '';
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input:</span>
                <t-textarea placeholder="Enter text to encode or HTML entities to decode..." rows="6" .value=${String(this.input)} @t-input=${this.handleInputChange}></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.encode}>Encode to HTML</t-button>
                <t-button variant="blue" @click=${this.decode}>Decode from HTML</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
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
        'html-encoder-decoder': HtmlEncoderDecoder;
    }
}
