import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import binaryToTextConverterStyles from './binary-to-text-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('binary-to-text-converter')
export class BinaryToTextConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, binaryToTextConverterStyles];

    @property({ type: String }) inputBinary = '';
    @property({ type: String }) outputText = '';
    @property({ type: String }) error = '';

    private handleInput(e: Event) {
        this.inputBinary = (e.target as HTMLTextAreaElement).value;
        this.error = '';
        try {
            this.outputText = this.binaryToText(this.inputBinary);
        } catch (err) {
            this.error = 'Invalid binary input. Please enter binary numbers (0s and 1s) separated by spaces.';
            this.outputText = '';
        }
    }

    private binaryToText(binary: string): string {
        const binaryArray = binary.trim().split(/\s+/);
        return binaryArray
            .map(bin => {
                const decimal = parseInt(bin, 2);
                if (isNaN(decimal) || bin.length === 0) {
                    throw new Error('Invalid binary');
                }

                return String.fromCharCode(decimal);
            })
            .join('');
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Binary Input:</label>
                    <textarea
                        class="form-input w-full h-32 font-mono"
                        placeholder="Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)..."
                        .value=${this.inputBinary}
                        @input=${this.handleInput}
                    ></textarea>
                    ${this.error ? html`<p class="text-red-600 text-sm mt-1">${this.error}</p>` : ''}
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Text Output:</label>
                    <textarea
                        class="form-input w-full h-32"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                    ${this.outputText ? html`<t-copy-button .text=${this.outputText}></t-copy-button>` : ''}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'binary-to-text-converter': BinaryToTextConverter;
    }
}
