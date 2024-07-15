import { html, customElement, property, state } from 'lit-element';
import { WebComponentBase, IConfigBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import javascriptBeautifierStyles from './javascript-beautifier.css.js';
import '../_libs/js-beautify/beautify.min.js';
import { isBrowser } from '../_utils/DomUtils.js';

@customElement('javascript-beautifier')
export class JavascriptBeautifier extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, javascriptBeautifierStyles];

    @property({ type: String }) codeInput = '';
    @state() indentSize = 4;
    @state() addNewlines = true;
    @state() spaceBeforeConditional = true;
    @state() breakChainedMethods = false;
    @state() commaFirst = false;
    @state() keepArrayIndentation = false;

    private onInputChange(event: Event) {
        const inputElement = event.target as HTMLTextAreaElement;
        this.codeInput = inputElement.value;
    }

    private onBeautify() {
        const js_beautify = isBrowser() ? (window as any).js_beautify : undefined;
        if (!js_beautify) {
            return;
        }

        this.codeInput = js_beautify(this.codeInput, {
            indent_size: this.indentSize,
            space_in_empty_paren: true,
            jslint_happy: true,
            indent_with_tabs: false,
            space_after_anon_function: true,
            end_with_newline: this.addNewlines,
            brace_style: 'collapse',
            break_chained_methods: this.breakChainedMethods,
            keep_array_indentation: this.keepArrayIndentation,
            unescape_strings: false,
            wrap_line_length: 0,
            e4x: false,
            comma_first: this.commaFirst,
            operator_position: this.spaceBeforeConditional ? 'before-newline' : 'after-newline',
            space_before_conditional: this.spaceBeforeConditional,
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
            <div class="javascript-beautifier">
                <div class="config grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <label class="flex items-center">
                    Indent size:
                    <input type="number" class="ml-2 form-input" .value="${this.indentSize}" @input="${this.onIndentSizeChange}" min="1" />
                </label>
                <label class="flex items-center">
                    Add newlines:
                    <input type="checkbox" class="ml-2 form-checkbox" name="addNewlines" .checked="${this.addNewlines}" @change="${this.onCheckboxChange}" />
                </label>
                <label class="flex items-center">
                    Space before conditional:
                    <input type="checkbox" class="ml-2 form-checkbox" name="spaceBeforeConditional" .checked="${this.spaceBeforeConditional}" @change="${this.onCheckboxChange}" />
                </label>
                <label class="flex items-center">
                    Break chained methods:
                    <input type="checkbox" class="ml-2 form-checkbox" name="breakChainedMethods" .checked="${this.breakChainedMethods}" @change="${this.onCheckboxChange}" />
                </label>
                <label class="flex items-center">
                    Comma first:
                    <input type="checkbox" class="ml-2 form-checkbox" name="commaFirst" .checked="${this.commaFirst}" @change="${this.onCheckboxChange}" />
                </label>
                <label class="flex items-center">
                    Keep array indentation:
                    <input type="checkbox" class="ml-2 form-checkbox" name="keepArrayIndentation" .checked="${this.keepArrayIndentation}" @change="${this.onCheckboxChange}" />
                </label>
                </div>
                <div class="editor mb-4">
                <textarea class="form-textarea w-full h-64 p-2 border border-gray-300 rounded-md" .value="${this.codeInput}" @input="${this.onInputChange}" placeholder="Paste your JavaScript code here..."></textarea>
                </div>
                <button class="btn btn-green px-4 py-2 bg-green-500 text-white rounded-md" @click="${this.onBeautify}">Beautify</button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'javascript-beautifier': JavascriptBeautifier;
    }
}
