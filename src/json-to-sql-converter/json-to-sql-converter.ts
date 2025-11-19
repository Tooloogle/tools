import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonToSqlConverterStyles from './json-to-sql-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('json-to-sql-converter')
export class JsonToSqlConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jsonToSqlConverterStyles];

    override render() {
        return html`
            <h2>
                json-to-sql-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-to-sql-converter': JsonToSqlConverter;
    }
}
