import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import tsvToJsonConverterStyles from './tsv-to-json-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('tsv-to-json-converter')
export class TsvToJsonConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, tsvToJsonConverterStyles];

    override render() {
        return html`
            <h2>
                tsv-to-json-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'tsv-to-json-converter': TsvToJsonConverter;
    }
}
