import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import gifToWebpConverterStyles from './gif-to-webp-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('gif-to-webp-converter')
export class GifToWebpConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, gifToWebpConverterStyles];

    override render() {
        return html`
            <h2>
                gif-to-webp-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'gif-to-webp-converter': GifToWebpConverter;
    }
}
