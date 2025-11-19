import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import faviconGeneratorStyles from './favicon-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('favicon-generator')
export class FaviconGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, faviconGeneratorStyles];

    override render() {
        return html`
            <h2>
                favicon-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'favicon-generator': FaviconGenerator;
    }
}
