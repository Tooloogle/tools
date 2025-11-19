import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssBoxShadowGeneratorStyles from './css-box-shadow-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('css-box-shadow-generator')
export class CssBoxShadowGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, cssBoxShadowGeneratorStyles];

    override render() {
        return html`
            <h2>
                css-box-shadow-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-box-shadow-generator': CssBoxShadowGenerator;
    }
}
