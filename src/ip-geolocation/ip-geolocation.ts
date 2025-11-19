import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import ipGeolocationStyles from './ip-geolocation.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('ip-geolocation')
export class IpGeolocation extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, ipGeolocationStyles];

    override render() {
        return html`
            <h2>
                ip-geolocation
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ip-geolocation': IpGeolocation;
    }
}
