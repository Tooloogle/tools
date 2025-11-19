import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import rgbToHslConverterStyles from './rgb-to-hsl-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('rgb-to-hsl-converter')
export class RgbToHslConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, rgbToHslConverterStyles];

    override render() {
        return html`
            <h2>
                rgb-to-hsl-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'rgb-to-hsl-converter': RgbToHslConverter;
    }
}
