import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import dnsLookupStyles from './dns-lookup.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('dns-lookup')
export class DnsLookup extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, dnsLookupStyles];

    @property({ type: String }) domain = '';
    @property({ type: String }) recordType = 'A';
    @property({ type: Array }) results: any[] = [];
    @property({ type: String }) error = '';
    @property({ type: Boolean }) loading = false;

    private async lookup() {
        if (!this.domain) return;
        
        this.loading = true;
        this.error = '';
        this.results = [];
        
        try {
            const response = await fetch(
                `https://dns.google/resolve?name=${encodeURIComponent(this.domain)}&type=${this.recordType}`
            );
            const data = await response.json();
            
            if (data.Status === 0 && data.Answer) {
                this.results = data.Answer;
            } else {
                this.error = 'No records found';
            }
        } catch (err) {
            this.error = `Error: ${(err as Error).message}`;
        } finally {
            this.loading = false;
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Domain Name:</label>
                    <input
                        type="text"
                        class="form-input w-full"
                        placeholder="example.com"
                        .value=${this.domain}
                        @input=${(e: Event) => { this.domain = (e.target as HTMLInputElement).value; }}
                        @keypress=${(e: KeyboardEvent) => { if (e.key === 'Enter') void this.lookup(); }}
                    />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-2 font-semibold">Record Type:</label>
                        <select class="form-input w-full" .value=${this.recordType}
                            @change=${(e: Event) => { this.recordType = (e.target as HTMLSelectElement).value; }}>
                            <option value="A">A</option>
                            <option value="AAAA">AAAA</option>
                            <option value="CNAME">CNAME</option>
                            <option value="MX">MX</option>
                            <option value="TXT">TXT</option>
                            <option value="NS">NS</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button class="btn btn-blue w-full" @click=${this.lookup} ?disabled=${this.loading}>
                            ${this.loading ? 'Looking up...' : 'Lookup'}
                        </button>
                    </div>
                </div>
                ${this.error ? html`<div class="text-red-600 text-sm">${this.error}</div>` : ''}
                ${this.results.length > 0 ? html`
                    <div class="bg-gray-50 p-4 rounded space-y-2">
                        ${this.results.map(record => html`
                            <div class="bg-white p-3 rounded border">
                                <div class="font-mono text-sm">${record.data}</div>
                                <div class="text-xs text-gray-500 mt-1">Type: ${record.type} | TTL: ${record.TTL}s</div>
                            </div>
                        `)}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'dns-lookup': DnsLookup;
    }
}