import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import punycodeConverterStyles from './punycode-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('punycode-converter')
export class PunycodeConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, punycodeConverterStyles];

    override render() {
        return html`
            <h2>
                punycode-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'punycode-converter': PunycodeConverter;
    }
}
