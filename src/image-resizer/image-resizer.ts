import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageResizerStyles from './image-resizer.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('image-resizer')
export class ImageResizer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, imageResizerStyles];

    override render() {
        return html`
            <h2>
                image-resizer
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'image-resizer': ImageResizer;
    }
}
