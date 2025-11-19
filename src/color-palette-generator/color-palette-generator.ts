import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import colorPaletteGeneratorStyles from './color-palette-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('color-palette-generator')
export class ColorPaletteGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, colorPaletteGeneratorStyles];

    override render() {
        return html`
            <h2>
                color-palette-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'color-palette-generator': ColorPaletteGenerator;
    }
}
