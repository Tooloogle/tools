import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import metaTagsGeneratorStyles from './meta-tags-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('meta-tags-generator')
export class MetaTagsGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, metaTagsGeneratorStyles];

    override render() {
        return html`
            <h2>
                meta-tags-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'meta-tags-generator': MetaTagsGenerator;
    }
}
