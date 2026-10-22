import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import directToSignalStyles from './direct-to-signal.css.js';
import { customElement, property } from 'lit/decorators.js';
import { buildSignalUrl } from '../_utils/provider-links.js';
import '../t-copy-button/index.js';

@customElement('direct-to-signal')
export class DirectToSignal extends WebComponentBase {
    static override styles = [WebComponentBase.styles, directToSignalStyles];

    @property() mode = 'phone';
    @property() input = '';
    @property() output = '';
    @property() error = '';

    private refresh() {
        this.output = '';
        this.error = '';
        if (!this.input.trim()) {
            return;
        }

        try {
            this.output = buildSignalUrl(this.input, this.mode);
        } catch {
            this.error = this.mode === 'phone' ? 'Enter an international phone number with its country code.'
                : 'Enter a personal share link copied from Signal.';
        }
    }

    private changeInput(event: Event) {
        this.input = (event.target as HTMLInputElement).value;
        this.refresh();
    }

    private changeMode(event: Event) {
        this.mode = (event.target as HTMLInputElement).value;
        this.reset();
    }

    private reset() {
        this.input = '';
        this.refresh();
    }

    override render() {
        return html`
            <div class="space-y-4 text-gray-900 dark:text-gray-100">
                <fieldset>
                    <legend>Contact by</legend>
                    <div class="flex flex-wrap gap-4 py-2">
                        <label class="flex items-center gap-2">
                            <input type="radio" name="mode" value="phone" .checked=${this.mode === 'phone'} @change=${this.changeMode} />
                            Phone number
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="radio" name="mode" value="link" .checked=${this.mode === 'link'} @change=${this.changeMode} />
                            Personal share link
                        </label>
                    </div>
                </fieldset>
                <label class="block">${this.mode === 'phone' ? 'Phone number with country code' : 'Signal personal share URL'}
                    <input name="contact" class="form-input" type=${this.mode === 'phone' ? 'tel' : 'url'}
                        placeholder=${this.mode === 'phone' ? '+1 202 555 0123' : 'https://signal.me/#eu/...'}
                        .value=${this.input} @input=${this.changeInput} />
                </label>
                ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
                <label class="block">Signal chat link
                    <input type="text" data-output class="form-input font-mono text-sm" readonly .value=${this.output} />
                </label>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <button class="btn btn-red" @click=${this.reset}>Reset</button>
                    <t-copy-button .isIcon=${false} .text=${this.output} .disabled=${!this.output}></t-copy-button>
                    <a class="btn btn-blue" href=${this.output || '#'} target="_blank" rel="noopener noreferrer"
                        aria-disabled=${!this.output} tabindex=${this.output ? 0 : -1}>Open Signal</a>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'direct-to-signal': DirectToSignal;
    }
}
