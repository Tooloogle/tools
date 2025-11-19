import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import colorShadeGeneratorStyles from './color-shade-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('color-shade-generator')
export class ColorShadeGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, colorShadeGeneratorStyles];

    override render() {
        return html`
            <h2>
                color-shade-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'color-shade-generator': ColorShadeGenerator;
    }
}
