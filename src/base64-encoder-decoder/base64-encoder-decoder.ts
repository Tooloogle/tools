import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import base64EncoderDecoderStyles from './base64-encoder-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('base64-encoder-decoder')
export class Base64EncoderDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, base64EncoderDecoderStyles];

    @property()
    encoded = "";

    @property()
    decoded = "";
    
    private onDecodedChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this.decoded = target.value;
        try {
            this.encoded = btoa(this.decoded);
        } catch (err) {
            console.error(err);
        }
    }

    private onEncodedChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this.encoded = target.value;
        try {
            this.decoded = atob(this.encoded);
        } catch (err) {
            console.error(err);
        }
    }

    override render() {
        return html`
        <div>
            <label class="block">
                <span class="inline-block py-1">Text to encode (decoded)</span>
                <textarea
                    name="email"
                    class="form-textarea"
                    autofocus
                    placeholder="Enter text to encode"
                    rows="5"
                    .value=${this.decoded}
                    @keyup=${this.onDecodedChange}></textarea>
            </label>
            <label class="block">
                <span class="inline-block py-1">Base64 string to decode (encoded)</span>
                <textarea
                    name="email"
                    class="form-textarea"
                    rows="5"
                    placeholder="Enter base64 string to decode"
                    .value=${this.encoded}
                    @keyup=${this.onEncodedChange}></textarea>
            </label>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'base64-encoder-decoder': Base64EncoderDecoder;
    }
}
