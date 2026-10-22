import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import utmTrackerRemoverStyles from './utm-tracker-remover.css.js';
import { customElement, property } from 'lit/decorators.js';
import { cleanTrackingUrl } from '../_utils/campaign-urls.js';
import '../t-copy-button/index.js';

@customElement('utm-tracker-remover')
export class UtmTrackerRemover extends WebComponentBase {
    static override styles = [WebComponentBase.styles, utmTrackerRemoverStyles];

    @property() input = '';
    @property() output = '';
    @property() error = '';
    @property({ type: Boolean }) extraTrackers = false;
    @property({ attribute: false }) removed: string[] = [];

    private refresh() {
        this.output = '';
        this.error = '';
        this.removed = [];
        if (!this.input.trim()) {
            return;
        }

        try {
            const result = cleanTrackingUrl(this.input, this.extraTrackers);
            this.output = result.url;
            this.removed = result.removed;
        } catch {
            this.error = 'Enter an absolute HTTP or HTTPS URL without credentials.';
        }
    }

    private changeUrl(event: Event) {
        this.input = (event.target as HTMLInputElement).value;
        this.refresh();
    }

    private changeTrackers(event: Event) {
        this.extraTrackers = (event.target as HTMLInputElement).checked;
        this.refresh();
    }

    private reset() {
        this.input = '';
        this.extraTrackers = false;
        this.refresh();
    }

    override render() {
        return html`
            <div class="space-y-4 text-gray-900 dark:text-gray-100">
                <label class="block">URL
                    <input type="url" name="url" class="form-input" placeholder="https://example.com/?utm_source=newsletter"
                        .value=${this.input} @input=${this.changeUrl} />
                </label>
                <label class="flex items-center gap-2">
                    <input type="checkbox" .checked=${this.extraTrackers} @change=${this.changeTrackers} />
                    Remove known click trackers too
                </label>
                ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
                ${this.output ? html`<p role="status" class="break-words text-sm">
                    ${this.removed.length ? `Removed: ${this.removed.join(', ')}` : 'No tracking parameters found.'}
                </p>` : ''}
                <label class="block">Clean URL
                    <input type="text" data-output class="form-input font-mono text-sm" readonly .value=${this.output} />
                </label>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <button class="btn btn-red" @click=${this.reset}>Reset</button>
                    <t-copy-button .isIcon=${false} .text=${this.output} .disabled=${!this.output}></t-copy-button>
                    <a class="btn btn-blue" href=${this.output || '#'} target="_blank" rel="noopener noreferrer"
                        aria-disabled=${!this.output} tabindex=${this.output ? 0 : -1}>Open URL</a>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'utm-tracker-remover': UtmTrackerRemover;
    }
}
