import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlTagsStripperStyles from './html-tags-stripper.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('html-tags-stripper')
export class HtmlTagsStripper extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, htmlTagsStripperStyles];

    override render() {
        return html`
            <h2>
                html-tags-stripper
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'html-tags-stripper': HtmlTagsStripper;
    }
}
