import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import rot13EncoderDecoderStyles from './rot13-encoder-decoder.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('rot13-encoder-decoder')
export class Rot13EncoderDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, rot13EncoderDecoderStyles];

    override render() {
        return html`
            <h2>
                rot13-encoder-decoder
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'rot13-encoder-decoder': Rot13EncoderDecoder;
    }
}
