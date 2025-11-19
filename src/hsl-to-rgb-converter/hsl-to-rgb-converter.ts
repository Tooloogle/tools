import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import hslToRgbConverterStyles from './hsl-to-rgb-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('hsl-to-rgb-converter')
export class HslToRgbConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, hslToRgbConverterStyles];

    override render() {
        return html`
            <h2>
                hsl-to-rgb-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hsl-to-rgb-converter': HslToRgbConverter;
    }
}
