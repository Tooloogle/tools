import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import htaccessGeneratorStyles from './htaccess-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('htaccess-generator')
export class HtaccessGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, htaccessGeneratorStyles];

    override render() {
        return html`
            <h2>
                htaccess-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'htaccess-generator': HtaccessGenerator;
    }
}
