import { html, customElement, property, state } from 'lit-element';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import htmlBeautifierStyles from './html-beautifier.css.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../_libs/js-beautify/beautify-html.min.js';

@customElement('html-beautifier')
export class HtmlBeautifier extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, htmlBeautifierStyles];

    @property({ type: String }) codeInput = '';
    @state() indentSize = 4;
    @state() useSpaces = true;
    @state() maxPreserveNewlines = 10;
    @state() preserveNewlines = true;
    @state() wrapLineLength = 0;
    @state() endWithNewline = true;
    @state() unformatted = '';

    private onInputChange(event: Event) {
        const inputElement = event.target as HTMLTextAreaElement;
        this.codeInput = inputElement.value;
    }

    private onBeautify() {
        const html_beautify = isBrowser() ? (window as any).html_beautify : undefined;
        if (!html_beautify) {
            return;
        }

        this.codeInput = html_beautify(this.codeInput, {
            indent_size: this.indentSize,
            indent_with_tabs: !this.useSpaces,
            preserve_newlines: this.preserveNewlines,
            max_preserve_newlines: this.maxPreserveNewlines,
            wrap_line_length: this.wrapLineLength,
            end_with_newline: this.endWithNewline,
            unformatted: this.unformatted.split(',').map(tag => tag.trim())
        });
    }

    private onIndentSizeChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.indentSize = parseInt(inputElement.value);
    }

    private onMaxPreserveNewlinesChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.maxPreserveNewlines = parseInt(inputElement.value);
    }

    private onWrapLineLengthChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.wrapLineLength = parseInt(inputElement.value);
    }

    private onCheckboxChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        (this as any)[inputElement.name] = inputElement.checked;
    }

    private onUnformattedChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.unformatted = inputElement.value;
    }

    render() {
        return html`
            <div class="html-beautifier">
                <div class="config grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <label class="flex items-center">
                    Indent size:
                    <input type="number" class="ml-2 form-input" .value="${this.indentSize}" @input="${this.onIndentSizeChange}" min="1" />
                </label>
                <label class="flex items-center">
                    Use spaces:
                    <input type="checkbox" class="ml-2 form-checkbox" name="useSpaces" .checked="${this.useSpaces}" @change="${this.onCheckboxChange}" />
                </label>
                <label class="flex items-center">
                    Preserve newlines:
                    <input type="checkbox" class="ml-2 form-checkbox" name="preserveNewlines" .checked="${this.preserveNewlines}" @change="${this.onCheckboxChange}" />
                </label>
                <label class="flex items-center">
                    Max preserve newlines:
                    <input type="number" class="ml-2 form-input" .value="${this.maxPreserveNewlines}" @input="${this.onMaxPreserveNewlinesChange}" min="0" />
                </label>
                <label class="flex items-center">
                    Wrap line length:
                    <input type="number" class="ml-2 form-input" .value="${this.wrapLineLength}" @input="${this.onWrapLineLengthChange}" min="0" />
                </label>
                <label class="flex items-center">
                    End with newline:
                    <input type="checkbox" class="ml-2 form-checkbox" name="endWithNewline" .checked="${this.endWithNewline}" @change="${this.onCheckboxChange}" />
                </label>
                <label class="flex items-center">
                    Unformatted tags (comma separated):
                    <input type="text" class="ml-2 form-input" .value="${this.unformatted}" @input="${this.onUnformattedChange}" placeholder="e.g., wbr" />
                </label>
                </div>
                <div class="editor mb-4">
                <textarea class="form-textarea w-full h-64 p-2 border border-gray-300 rounded-md" .value="${this.codeInput}" @input="${this.onInputChange}" placeholder="Paste your HTML code here..."></textarea>
                </div>
                <button class="btn btn-green px-4 py-2 bg-green-500 text-white rounded-md" @click="${this.onBeautify}">Beautify</button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'html-beautifier': HtmlBeautifier;
    }
}
