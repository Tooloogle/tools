import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import duplicateLineRemoverStyles from './duplicate-line-remover.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';
import '../t-button/t-button.js';
import '../t-textarea/t-textarea.js';

@customElement('duplicate-line-remover')
export class DuplicateLineRemover extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, duplicateLineRemoverStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    caseSensitive = true;

    @property()
    keepOrder = true;

    @property()
    removedCount = 0;

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
    }

    private handleCaseSensitiveChange(e: Event) {
        this.caseSensitive = (e.target as HTMLInputElement).checked;
    }

    private handleKeepOrderChange(e: Event) {
        this.keepOrder = (e.target as HTMLInputElement).checked;
    }

    private removeDuplicates() {
        const lines = this.input.split('\n');
        const seen = new Set<string>();
        const result: string[] = [];
        let removed = 0;

        for (const line of lines) {
            const key = this.caseSensitive ? line : line.toLowerCase();
            
            if (!seen.has(key)) {
                seen.add(key);
                result.push(line);
            } else {
                removed++;
            }
        }

        if (!this.keepOrder) {
            result.sort((a, b) => {
                if (!this.caseSensitive) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                }

                return a.localeCompare(b);
            });
        }

        this.output = result.join('\n');
        this.removedCount = removed;
    }

    private clear() {
        this.input = '';
        this.output = '';
        this.removedCount = 0;
    }

    private renderControlsSection() {
        return html`
            <div class="py-2 space-y-2">
                <label class="flex items-center">
                    <input
                        type="checkbox"
                        class="form-checkbox"
                        .checked=${this.caseSensitive}
                        @change=${this.handleCaseSensitiveChange}
                    />
                    <span class="ml-2">Case sensitive</span>
                </label>

                <label class="flex items-center">
                    <input
                        type="checkbox"
                        class="form-checkbox"
                        .checked=${this.keepOrder}
                        @change=${this.handleKeepOrderChange}
                    />
                    <span class="ml-2">Keep original order</span>
                </label>
            </div>

            <div class="py-2 text-right">
                <t-button variant="blue" @click=${this.removeDuplicates}>Remove Duplicates</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>
        `;
    }

    private renderOutputSection() {
        return html`
            <div class="mb-2">
                <span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded">
                    Removed ${this.removedCount} duplicate line${this.removedCount !== 1 ? 's' : ''}
                </span>
            </div>

            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Output:</span>
                <t-textarea rows="10" .value=${String(this.output)} ?readonly=${true}></t-textarea>
                <div class="py-2 text-right">
                    <t-copy-button .isIcon=${false} .text=${this.output}></t-copy-button>
                </div>
            </label>
        `;
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input Text:</span>
                <t-textarea placeholder="Enter text with duplicate lines..." rows="10" .value=${String(this.input)} @t-input=${this.handleInputChange}></t-textarea>
            </label>

            ${this.renderControlsSection()}

            ${this.output ? this.renderOutputSection() : ''}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'duplicate-line-remover': DuplicateLineRemover;
    }
}
