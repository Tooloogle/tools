import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlToMarkdownConverterStyles from './html-to-markdown-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('html-to-markdown-converter')
export class HtmlToMarkdownConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, htmlToMarkdownConverterStyles];

    override render() {
        return html`
            <h2>
                html-to-markdown-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'html-to-markdown-converter': HtmlToMarkdownConverter;
    }
}
