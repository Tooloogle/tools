import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import instagramDmLinkGeneratorStyles from './instagram-dm-link-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import { buildInstagramUrl } from '../_utils/provider-links.js';
import '../t-copy-button/index.js';

@customElement('instagram-dm-link-generator')
export class InstagramDmLinkGenerator extends WebComponentBase {
    static override styles = [WebComponentBase.styles, instagramDmLinkGeneratorStyles];

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
            this.output = buildInstagramUrl(this.input);
        } catch (error) {
            this.error = (error as Error).message;
        }
    }

    private changeInput(event: Event) {
        this.input = (event.target as HTMLInputElement).value;
        this.refresh();
    }

    private reset() {
        this.input = '';
        this.refresh();
    }

    override render() {
        return html`
            <div class="space-y-4 text-gray-900 dark:text-gray-100">
                <label class="block">Instagram username or profile URL
                    <input class="form-input" placeholder="@username" .value=${this.input} @input=${this.changeInput} />
                </label>
                ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
                <label class="block">DM link
                    <input type="text" data-output class="form-input font-mono text-sm" readonly .value=${this.output} />
                </label>
                <div class="flex flex-wrap items-center justify-end gap-2">
                    <button class="btn btn-red" @click=${this.reset}>Reset</button>
                    <t-copy-button .isIcon=${false} .text=${this.output} .disabled=${!this.output}></t-copy-button>
                    <a class="btn btn-blue" href=${this.output || '#'} target="_blank" rel="noopener noreferrer"
                        aria-disabled=${!this.output} tabindex=${this.output ? 0 : -1}>Open Instagram</a>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'instagram-dm-link-generator': InstagramDmLinkGenerator;
    }
}
