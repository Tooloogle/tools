import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import pngToSvgConverterStyles from './png-to-svg-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('png-to-svg-converter')
export class PngToSvgConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, pngToSvgConverterStyles];

    override render() {
        return html`
            <h2>
                png-to-svg-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'png-to-svg-converter': PngToSvgConverter;
    }
}
