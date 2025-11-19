import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import yamlToXmlConverterStyles from './yaml-to-xml-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('yaml-to-xml-converter')
export class YamlToXmlConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, yamlToXmlConverterStyles];

    override render() {
        return html`
            <h2>
                yaml-to-xml-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'yaml-to-xml-converter': YamlToXmlConverter;
    }
}
