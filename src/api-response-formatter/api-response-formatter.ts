import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import apiResponseFormatterStyles from './api-response-formatter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('api-response-formatter')
export class ApiResponseFormatter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, apiResponseFormatterStyles];

    override render() {
        return html`
            <h2>
                api-response-formatter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'api-response-formatter': ApiResponseFormatter;
    }
}
