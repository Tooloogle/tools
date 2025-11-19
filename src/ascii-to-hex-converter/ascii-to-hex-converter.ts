import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import asciiToHexConverterStyles from './ascii-to-hex-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('ascii-to-hex-converter')
export class AsciiToHexConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, asciiToHexConverterStyles];

    override render() {
        return html`
            <h2>
                ascii-to-hex-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ascii-to-hex-converter': AsciiToHexConverter;
    }
}
