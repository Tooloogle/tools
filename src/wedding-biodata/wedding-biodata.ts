import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import weddingBiodataStyles from './wedding-biodata.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('wedding-biodata')
export class WeddingBiodata extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, weddingBiodataStyles];

    override render() {
        return html`
            <h2>
                wedding-biodata
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'wedding-biodata': WeddingBiodata;
    }
}
