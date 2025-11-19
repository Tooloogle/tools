import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import imageFilterStyles from './image-filter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('image-filter')
export class ImageFilter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, imageFilterStyles];

    override render() {
        return html`
            <h2>
                image-filter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'image-filter': ImageFilter;
    }
}
