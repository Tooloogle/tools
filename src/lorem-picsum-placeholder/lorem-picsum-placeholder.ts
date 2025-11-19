import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import loremPicsumPlaceholderStyles from './lorem-picsum-placeholder.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('lorem-picsum-placeholder')
export class LoremPicsumPlaceholder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, loremPicsumPlaceholderStyles];

    override render() {
        return html`
            <h2>
                lorem-picsum-placeholder
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lorem-picsum-placeholder': LoremPicsumPlaceholder;
    }
}
