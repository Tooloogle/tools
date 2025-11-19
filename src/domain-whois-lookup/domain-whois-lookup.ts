import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import domainWhoisLookupStyles from './domain-whois-lookup.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('domain-whois-lookup')
export class DomainWhoisLookup extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, domainWhoisLookupStyles];

    override render() {
        return html`
            <h2>
                domain-whois-lookup
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'domain-whois-lookup': DomainWhoisLookup;
    }
}
