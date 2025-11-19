import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import hashFileVerifierStyles from './hash-file-verifier.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('hash-file-verifier')
export class HashFileVerifier extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, hashFileVerifierStyles];

    override render() {
        return html`
            <h2>
                hash-file-verifier
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hash-file-verifier': HashFileVerifier;
    }
}
