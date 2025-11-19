import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import restApiTesterStyles from './rest-api-tester.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('rest-api-tester')
export class RestApiTester extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, restApiTesterStyles];

    override render() {
        return html`
            <h2>
                rest-api-tester
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'rest-api-tester': RestApiTester;
    }
}
