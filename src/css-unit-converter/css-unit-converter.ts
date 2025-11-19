import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssUnitConverterStyles from './css-unit-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('css-unit-converter')
export class CssUnitConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, cssUnitConverterStyles];

    override render() {
        return html`
            <h2>
                css-unit-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-unit-converter': CssUnitConverter;
    }
}
