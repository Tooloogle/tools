import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import utmUrlBuilderStyles from './utm-url-builder.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { buildUtmUrl, readUtmFields, UTM_FIELDS } from '../_utils/campaign-urls.js';
import '../t-copy-button/index.js';

@customElement('utm-url-builder')
export class UtmUrlBuilder extends WebComponentBase {
    static override styles = [WebComponentBase.styles, utmUrlBuilderStyles];

    @property() input = '';
    @property() output = '';
    @property() error = '';
    @state() private fields: Record<string, string> = {};
    private importedFields: Record<string, string> = {};

    private refresh() {
        this.output = '';
        this.error = '';
        if (!this.input.trim()) {
            return;
        }

        try {
            this.output = buildUtmUrl(this.input, this.fields);
        } catch (error) {
            this.error = error instanceof TypeError ? 'Enter an absolute HTTP or HTTPS URL.' : (error as Error).message;
        }
    }

    private changeUrl(event: Event) {
        this.input = (event.target as HTMLInputElement).value;
        try {
            const existing = readUtmFields(this.input);
            const changed = UTM_FIELDS.some(field => existing[field] !== (this.importedFields[field] ?? ''));
            if (changed && Object.values(existing).some(Boolean)) {
                this.fields = existing;
            }

            this.importedFields = existing;
        } catch {
            this.output = '';
        }

        this.refresh();
    }

    private changeField(event: Event) {
        const input = event.target as HTMLInputElement;
        this.fields = { ...this.fields, [input.name]: input.value };
        this.refresh();
    }

    private reset() {
        this.input = '';
        this.fields = {};
        this.importedFields = {};
        this.refresh();
    }

    private fieldKey = (field: string) => field;

    private renderField = (field: string) => html`
        <label class="block">${field.charAt(0).toUpperCase() + field.slice(1)}${['source', 'medium', 'campaign'].includes(field) ? ' *' : ' (optional)'}
            <input class="form-input" name=${field} .value=${this.fields[field] ?? ''}
                ?required=${['source', 'medium', 'campaign'].includes(field)} @input=${this.changeField} />
        </label>`;

    override render() {
        return html`
            <div class="space-y-4 text-gray-900 dark:text-gray-100">
                <label class="block">Destination URL
                    <input class="form-input" name="url" type="url" placeholder="https://example.com/page"
                        .value=${this.input} @input=${this.changeUrl} />
                </label>
                <div class="campaign-fields">${repeat(UTM_FIELDS, this.fieldKey, this.renderField)}</div>
                ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
                <label class="block">Campaign URL
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
        'utm-url-builder': UtmUrlBuilder;
    }
}
