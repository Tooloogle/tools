import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import dnsLookupStyles from './dns-lookup.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('dns-lookup')
export class DnsLookup extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, dnsLookupStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        // TODO: [Server/API] DNS lookups require server-side DNS queries
        this.outputText = 'DNS lookup requires server-side DNS query capability';
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Input:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter input..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Output:</label>
                    <textarea
                        class="form-input w-full h-32 bg-yellow-50"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'dns-lookup': DnsLookup;
    }
}
