import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import aesEncryptionStyles from './aes-encryption.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('aes-encryption')
export class AesEncryption extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, aesEncryptionStyles];

    override render() {
        return html`
            <h2>
                aes-encryption
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'aes-encryption': AesEncryption;
    }
}
