import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from "../_styles/input.css.js"
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import emailValidatorStyles from './url-encoder-decoder.css.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('url-encoder-decoder')
export class UrlEncoderDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, emailValidatorStyles];

    @property()
    value = "";

    onChange(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    }

    encode() {
        if (this.value) {
            this.value = encodeURIComponent(this.value);
        }

        this.requestUpdate();
    }

    decode() {
        if (this.value) {
            this.value = decodeURIComponent(this.value);
        }

        this.requestUpdate();
    }

    override render() {
        return html`
        <lable class="block">
            <textarea
                name="encoded"
                class="form-textarea"
                autofocus
                rows="5"
                .value=${this.value}
                @keyup=${this.onChange}
                @change=${this.onChange}></textarea>
        </lable>
        <div class="text-end">
            <button class="btn btn-blue" @click=${this.encode}>Encode</button>
            <button class="btn btn-blue" @click=${this.decode}>Decode</button>
        </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'url-encoder-decoder': UrlEncoderDecoder;
    }
}
