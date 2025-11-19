import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import csvToXmlConverterStyles from './csv-to-xml-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('csv-to-xml-converter')
export class CsvToXmlConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, csvToXmlConverterStyles];

    override render() {
        return html`
            <h2>
                csv-to-xml-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'csv-to-xml-converter': CsvToXmlConverter;
    }
}
