import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textSorterStyles from './text-sorter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('text-sorter')
export class TextSorter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, textSorterStyles];

    @property()
    input = '';

    @property()
    output = '';

    @property()
    caseSensitive = false;

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private handleCaseSensitiveChange(e: Event) {
        this.caseSensitive = (e.target as HTMLInputElement).checked;
    }

    private sortAZ() {
        const lines = this.input.split('\n');
        this.output = lines.sort((a, b) => {
            if (!this.caseSensitive) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            }

            return a.localeCompare(b);
        }).join('\n');
    }

    private sortZA() {
        const lines = this.input.split('\n');
        this.output = lines.sort((a, b) => {
            if (!this.caseSensitive) {
                return b.toLowerCase().localeCompare(a.toLowerCase());
            }

            return b.localeCompare(a);
        }).join('\n');
    }

    private sortNumerically() {
        const lines = this.input.split('\n');
        this.output = lines.sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }

            return 0;
        }).join('\n');
    }

    private sortByLength() {
        const lines = this.input.split('\n');
        this.output = lines.sort((a, b) => a.length - b.length).join('\n');
    }

    private reverse() {
        const lines = this.input.split('\n');
        this.output = lines.reverse().join('\n');
    }

    private shuffle() {
        const lines = this.input.split('\n');
        for (let i = lines.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lines[i], lines[j]] = [lines[j], lines[i]];
        }

        this.output = lines.join('\n');
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input Text (one item per line):</span>
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to sort (one line per item)..."
                    rows="10"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

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

                <div class="flex flex-wrap gap-2">
                    <button class="btn btn-blue" @click=${this.sortAZ}>Sort A-Z</button>
                    <button class="btn btn-blue" @click=${this.sortZA}>Sort Z-A</button>
                    <button class="btn btn-blue" @click=${this.sortNumerically}>Sort Numerically</button>
                    <button class="btn btn-blue" @click=${this.sortByLength}>Sort by Length</button>
                    <button class="btn btn-blue" @click=${this.reverse}>Reverse</button>
                    <button class="btn btn-blue" @click=${this.shuffle}>Shuffle</button>
                    <button class="btn btn-red" @click=${this.clear}>Clear</button>
                </div>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <textarea
                        class="form-textarea"
                        rows="10"
                        readonly
                        .value=${this.output}
                    ></textarea>
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
        'text-sorter': TextSorter;
    }
}
