import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import bcryptHashGeneratorStyles from './bcrypt-hash-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('bcrypt-hash-generator')
export class BcryptHashGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, bcryptHashGeneratorStyles];

    override render() {
        return html`
            <h2>
                bcrypt-hash-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'bcrypt-hash-generator': BcryptHashGenerator;
    }
}
