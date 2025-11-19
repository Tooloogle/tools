import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import svgToPngConverterStyles from './svg-to-png-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('svg-to-png-converter')
export class SvgToPngConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, svgToPngConverterStyles];

    override render() {
        return html`
            <h2>
                svg-to-png-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'svg-to-png-converter': SvgToPngConverter;
    }
}
