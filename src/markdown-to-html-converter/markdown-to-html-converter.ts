import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import markdownToHtmlConverterStyles from './markdown-to-html-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('markdown-to-html-converter')
export class MarkdownToHtmlConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, markdownToHtmlConverterStyles];

    override render() {
        return html`
            <h2>
                markdown-to-html-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'markdown-to-html-converter': MarkdownToHtmlConverter;
    }
}
