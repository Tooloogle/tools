import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import jsonToTsvConverterStyles from './json-to-tsv-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('json-to-tsv-converter')
export class JsonToTsvConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, jsonToTsvConverterStyles];

    override render() {
        return html`
            <h2>
                json-to-tsv-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'json-to-tsv-converter': JsonToTsvConverter;
    }
}
