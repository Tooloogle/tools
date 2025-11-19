import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import xpathTesterStyles from './xpath-tester.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('xpath-tester')
export class XpathTester extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, xpathTesterStyles];

    override render() {
        return html`
            <h2>
                xpath-tester
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'xpath-tester': XpathTester;
    }
}
