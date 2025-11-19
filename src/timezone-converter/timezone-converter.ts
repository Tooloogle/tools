import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import timezoneConverterStyles from './timezone-converter.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('timezone-converter')
export class TimezoneConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, timezoneConverterStyles];

    override render() {
        return html`
            <h2>
                timezone-converter
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'timezone-converter': TimezoneConverter;
    }
}
