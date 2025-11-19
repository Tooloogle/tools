import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import cssBorderRadiusGeneratorStyles from './css-border-radius-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('css-border-radius-generator')
export class CssBorderRadiusGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, cssBorderRadiusGeneratorStyles];

    override render() {
        return html`
            <h2>
                css-border-radius-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-border-radius-generator': CssBorderRadiusGenerator;
    }
}
