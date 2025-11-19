import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import hexToAsciiConverterStyles from './hex-to-ascii-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('hex-to-ascii-converter')
export class HexToAsciiConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, hexToAsciiConverterStyles];

    override render() {
        return html`
            <h2>
                hex-to-ascii-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hex-to-ascii-converter': HexToAsciiConverter;
    }
}
