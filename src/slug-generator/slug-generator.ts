import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import slugGeneratorStyles from './slug-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('slug-generator')
export class SlugGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, slugGeneratorStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    separator = '-';

    @property()
    lowercase = true;

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
        this.generateSlug();
    }

    private handleSeparatorChange(e: Event) {
        this.separator = (e.target as HTMLSelectElement).value;
        this.generateSlug();
    }

    private handleLowercaseChange(e: Event) {
        this.lowercase = (e.target as HTMLInputElement).checked;
        this.generateSlug();
    }

    private generateSlug() {
        if (!this.input) {
            this.output = '';
            return;
        }

        let slug = this.input
            // Remove leading/trailing whitespace
            .trim()
            // Replace accented characters
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            // Convert to lowercase if needed
            .toLowerCase()
            // Replace spaces and special characters with separator
            .replace(/[^a-z0-9]+/g, this.separator)
            // Remove leading/trailing separators
            .replace(new RegExp(`^${this.separator}+|${this.separator}+$`, 'g'), '');

        if (!this.lowercase) {
            slug = this.input
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9]+/g, this.separator)
                .replace(new RegExp(`^${this.separator}+|${this.separator}+$`, 'g'), '');
        }

        this.output = slug;
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input Text:</span>
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to convert to slug..."
                    rows="4"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 space-y-2">
                <label class="block">
                    <span class="inline-block py-1 font-bold">Separator:</span>
                    <select
                        class="form-select"
                        .value=${this.separator}
                        @change=${this.handleSeparatorChange}
                    >
                        <option value="-">Hyphen (-)</option>
                        <option value="_">Underscore (_)</option>
                        <option value=".">Dot (.)</option>
                    </select>
                </label>

                <label class="flex items-center">
                    <input
                        type="checkbox"
                        class="form-checkbox"
                        .checked=${this.lowercase}
                        @change=${this.handleLowercaseChange}
                    />
                    <span class="ml-2">Convert to lowercase</span>
                </label>
            </div>

            <div class="py-2">
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Slug Output:</span>
                    <input
                        type="text"
                        class="form-input"
                        readonly
                        .value=${this.output}
                    />
                    <div class="py-2 text-right">
                        <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
                    </div>
                </label>
            ` : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'slug-generator': SlugGenerator;
    }
}
