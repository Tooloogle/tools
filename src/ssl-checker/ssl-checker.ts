import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import sslCheckerStyles from './ssl-checker.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('ssl-checker')
export class SslChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, sslCheckerStyles];

    override render() {
        return html`
            <h2>
                ssl-checker
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ssl-checker': SslChecker;
    }
}
