import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonToYamlConverterStyles from './json-to-yaml-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('json-to-yaml-converter')
export class JsonToYamlConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jsonToYamlConverterStyles];

    override render() {
        return html`
            <h2>
                json-to-yaml-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-to-yaml-converter': JsonToYamlConverter;
    }
}
