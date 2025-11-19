import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonSchemaValidatorStyles from './json-schema-validator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('json-schema-validator')
export class JsonSchemaValidator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jsonSchemaValidatorStyles];

    override render() {
        return html`
            <h2>
                json-schema-validator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-schema-validator': JsonSchemaValidator;
    }
}
