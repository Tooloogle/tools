import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import xmlToCsvConverterStyles from './xml-to-csv-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('xml-to-csv-converter')
export class XmlToCsvConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, xmlToCsvConverterStyles];

    override render() {
        return html`
            <h2>
                xml-to-csv-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'xml-to-csv-converter': XmlToCsvConverter;
    }
}
