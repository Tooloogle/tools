import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageCropperStyles from './image-cropper.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('image-cropper')
export class ImageCropper extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, imageCropperStyles];

    override render() {
        return html`
            <h2>
                image-cropper
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'image-cropper': ImageCropper;
    }
}
