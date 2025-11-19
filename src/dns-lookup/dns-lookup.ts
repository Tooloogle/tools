import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import dnsLookupStyles from './dns-lookup.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('dns-lookup')
export class DnsLookup extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, dnsLookupStyles];

    override render() {
        return html`
            <h2>
                dns-lookup
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'dns-lookup': DnsLookup;
    }
}
