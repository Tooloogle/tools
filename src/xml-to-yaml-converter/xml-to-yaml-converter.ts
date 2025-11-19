import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import xmlToYamlConverterStyles from './xml-to-yaml-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('xml-to-yaml-converter')
export class XmlToYamlConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, xmlToYamlConverterStyles];

    override render() {
        return html`
            <h2>
                xml-to-yaml-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'xml-to-yaml-converter': XmlToYamlConverter;
    }
}
