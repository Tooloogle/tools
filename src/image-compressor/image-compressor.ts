import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageCompressorStyles from './image-compressor.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('image-compressor')
export class ImageCompressor extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, imageCompressorStyles];

    override render() {
        return html`
            <h2>
                image-compressor
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'image-compressor': ImageCompressor;
    }
}
