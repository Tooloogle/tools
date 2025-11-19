import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import securePasswordTesterStyles from './secure-password-tester.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('secure-password-tester')
export class SecurePasswordTester extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, securePasswordTesterStyles];

    override render() {
        return html`
            <h2>
                secure-password-tester
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'secure-password-tester': SecurePasswordTester;
    }
}
