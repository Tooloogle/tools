import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import unitConverterStyles from './unit-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('unit-converter')
export class UnitConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, unitConverterStyles];

    override render() {
        return html`
            <h2>
                unit-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'unit-converter': UnitConverter;
    }
}
