import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlEncoderDecoderStyles from './html-encoder-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-copy-button/t-copy-button.js';

@customElement('html-encoder-decoder')
export class HtmlEncoderDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, htmlEncoderDecoderStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private encode() {
        if (!isBrowser()) {return;}

        const div = document.createElement('div');
        div.textContent = this.input;
        this.output = div.innerHTML;
    }

    private decode() {
        if (!isBrowser()) {return;}

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
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to encode or HTML entities to decode..."
                    rows="6"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.encode}>Encode to HTML</button>
                <button class="btn btn-blue" @click=${this.decode}>Decode from HTML</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
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
        'html-encoder-decoder': HtmlEncoderDecoder;
    }
}
