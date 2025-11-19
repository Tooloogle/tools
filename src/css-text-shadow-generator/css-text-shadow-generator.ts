import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssTextShadowGeneratorStyles from './css-text-shadow-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('css-text-shadow-generator')
export class CssTextShadowGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, cssTextShadowGeneratorStyles];

    override render() {
        return html`
            <h2>
                css-text-shadow-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-text-shadow-generator': CssTextShadowGenerator;
    }
}
