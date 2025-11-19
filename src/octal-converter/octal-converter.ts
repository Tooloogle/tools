import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import octalConverterStyles from './octal-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('octal-converter')
export class OctalConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, octalConverterStyles];

    override render() {
        return html`
            <h2>
                octal-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'octal-converter': OctalConverter;
    }
}
