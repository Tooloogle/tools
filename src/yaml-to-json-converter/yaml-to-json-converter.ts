import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import yamlToJsonConverterStyles from './yaml-to-json-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('yaml-to-json-converter')
export class YamlToJsonConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, yamlToJsonConverterStyles];

    override render() {
        return html`
            <h2>
                yaml-to-json-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'yaml-to-json-converter': YamlToJsonConverter;
    }
}
