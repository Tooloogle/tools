import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import aesDecryptionStyles from './aes-decryption.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('aes-decryption')
export class AesDecryption extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, aesDecryptionStyles];

    override render() {
        return html`
            <h2>
                aes-decryption
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'aes-decryption': AesDecryption;
    }
}
