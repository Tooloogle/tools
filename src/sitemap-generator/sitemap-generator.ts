import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import sitemapGeneratorStyles from './sitemap-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('sitemap-generator')
export class SitemapGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, sitemapGeneratorStyles];

    override render() {
        return html`
            <h2>
                sitemap-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'sitemap-generator': SitemapGenerator;
    }
}
