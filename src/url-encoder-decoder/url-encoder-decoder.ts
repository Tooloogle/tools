import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import emailValidatorStyles from './url-encoder-decoder.css.js';
import '../t-button';
import '../t-textarea';

@customElement('url-encoder-decoder')
export class UrlEncoderDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, emailValidatorStyles];

    @property()
    value = "";

    onChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this.value = target?.value;
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
            <t-textarea rows="5" .value="${this.value}" @t-input=${this.onChange}></t-textarea>
        </lable>
        <div class="text-end">
            <t-button variant="blue" @click=${this.encode}>Encode</t-button>
            <t-button variant="blue" @click=${this.decode}>Decode</t-button>
        </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'url-encoder-decoder': UrlEncoderDecoder;
    }
}
