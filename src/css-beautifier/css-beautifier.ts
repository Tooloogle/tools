import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import cssBeautifierStyles from './css-beautifier.css.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../_libs/js-beautify/beautify-css.min.js';

@customElement('css-beautifier')
export class CssBeautifier extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, cssBeautifierStyles];

    @property({ type: String }) codeInput = '';
    @state() indentSize = 4;
    @state() useSpaceAfterComma = true;
    @state() endWithNewline = true;

    private onInputChange(event: Event) {
        const inputElement = event.target as HTMLTextAreaElement;
        this.codeInput = inputElement.value;
    }

    private onBeautify() {
        const cssBeautify = isBrowser() ? (window as any).css_beautify : undefined;
        if (!cssBeautify) {
            return;
        }

        this.codeInput = cssBeautify(this.codeInput, {
            indent_size: this.indentSize,
            space_after_comma: this.useSpaceAfterComma,
            end_with_newline: this.endWithNewline
        });
    }

    private onIndentSizeChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.indentSize = parseInt(inputElement.value);
    }

    private onCheckboxChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        (this as any)[inputElement.name] = inputElement.checked;
    }

    render() {
        return html`
            <div class="css-beautifier">
                <div class="config grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <label class="flex items-center">
                    Indent size:
                    <input type="number" class="ml-2 form-input" .value="${this.indentSize}" @input="${this.onIndentSizeChange}" min="1" />
                </label>
                <label class="flex items-center">
                    Use space after comma:
                    <input type="checkbox" class="ml-2 form-checkbox" name="useSpaceAfterComma" .checked="${this.useSpaceAfterComma}" @change="${this.onCheckboxChange}" />
                </label>
                <label class="flex items-center">
                    End with newline:
                    <input type="checkbox" class="ml-2 form-checkbox" name="endWithNewline" .checked="${this.endWithNewline}" @change="${this.onCheckboxChange}" />
                </label>
                </div>
                <div class="editor mb-4">
                <textarea class="form-textarea w-full h-64 p-2 border border-gray-300 rounded-md" .value="${this.codeInput}" @input="${this.onInputChange}" placeholder="Paste your CSS code here..."></textarea>
                </div>
                <button class="btn btn-green px-4 py-2 bg-green-500 text-white rounded-md" @click="${this.onBeautify}">Beautify</button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'css-beautifier': CssBeautifier;
    }
}
