import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import directToViberStyles from './direct-to-viber.css.js';
import { customElement, property } from 'lit/decorators.js';
import { buildViberUrl } from '../_utils/provider-links.js';
import '../t-copy-button/index.js';

@customElement('direct-to-viber')
export class DirectToViber extends WebComponentBase {
    static override styles = [WebComponentBase.styles, directToViberStyles];

    @property() phone = '';
    @property() output = '';
    @property() error = '';

    private refresh() {
        this.output = '';
        this.error = '';
        if (!this.phone.trim()) {
            return;
        }

        try {
            this.output = buildViberUrl(this.phone);
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    private changePhone(event: Event) {
        this.phone = (event.target as HTMLInputElement).value;
        this.refresh();
    }

    private reset() {
        this.phone = '';
        this.refresh();
    }

    override render() {
        return html`
            <div class="space-y-4 text-gray-900 dark:text-gray-100">
                <label class="block">Phone number with country code
                    <input class="form-input" type="tel" placeholder="+1 202 555 0123"
                        .value=${this.phone} @input=${this.changePhone} />
                </label>
                ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
                <label class="block">Viber chat link
                    <input type="text" data-output class="form-input font-mono text-sm" readonly .value=${this.output} />
                </label>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <button class="btn btn-red" @click=${this.reset}>Reset</button>
                    <t-copy-button .isIcon=${false} .text=${this.output} .disabled=${!this.output}></t-copy-button>
                    <a class="btn btn-blue" href=${this.output || '#'} aria-disabled=${!this.output}
                        tabindex=${this.output ? 0 : -1}>Open Viber</a>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'direct-to-viber': DirectToViber;
    }
}
