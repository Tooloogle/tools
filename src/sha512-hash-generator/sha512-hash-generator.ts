import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import sha512HashGeneratorStyles from './sha512-hash-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('sha512-hash-generator')
export class Sha512HashGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, sha512HashGeneratorStyles];

    override render() {
        return html`
            <h2>
                sha512-hash-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'sha512-hash-generator': Sha512HashGenerator;
    }
}
