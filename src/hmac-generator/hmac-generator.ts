import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import hmacGeneratorStyles from './hmac-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('hmac-generator')
export class HmacGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, hmacGeneratorStyles];

    override render() {
        return html`
            <h2>
                hmac-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmac-generator': HmacGenerator;
    }
}
