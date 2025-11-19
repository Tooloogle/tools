import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import excelToJsonConverterStyles from './excel-to-json-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('excel-to-json-converter')
export class ExcelToJsonConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, excelToJsonConverterStyles];

    override render() {
        return html`
            <h2>
                excel-to-json-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'excel-to-json-converter': ExcelToJsonConverter;
    }
}
