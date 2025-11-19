import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import passphraseGeneratorStyles from './passphrase-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('passphrase-generator')
export class PassphraseGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, passphraseGeneratorStyles];

    override render() {
        return html`
            <h2>
                passphrase-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'passphrase-generator': PassphraseGenerator;
    }
}
