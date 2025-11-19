import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import sha256HashGeneratorStyles from './sha256-hash-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('sha256-hash-generator')
export class Sha256HashGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, sha256HashGeneratorStyles];

    override render() {
        return html`
            <h2>
                sha256-hash-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'sha256-hash-generator': Sha256HashGenerator;
    }
}
