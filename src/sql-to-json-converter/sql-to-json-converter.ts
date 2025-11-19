import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import sqlToJsonConverterStyles from './sql-to-json-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('sql-to-json-converter')
export class SqlToJsonConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, sqlToJsonConverterStyles];

    override render() {
        return html`
            <h2>
                sql-to-json-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'sql-to-json-converter': SqlToJsonConverter;
    }
}
