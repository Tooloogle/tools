import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import rsaKeyGeneratorStyles from './rsa-key-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('rsa-key-generator')
export class RsaKeyGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, rsaKeyGeneratorStyles];

    override render() {
        return html`
            <h2>
                rsa-key-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'rsa-key-generator': RsaKeyGenerator;
    }
}
