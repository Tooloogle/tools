import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import unicodeConverterStyles from './unicode-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';
import '../t-button/t-button.js';
import '../t-textarea/t-textarea.js';

@customElement('unicode-converter')
export class UnicodeConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, unicodeConverterStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
    }

    private toUnicode() {
        this.output = Array.from(this.input)
            .map(char => {
                const code = char.charCodeAt(0);
                return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
            })
            .join('');
    }

    private toUnicodeEscape() {
        this.output = Array.from(this.input)
            .map(char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
            .join('');
    }

    private fromUnicode() {
        try {
            this.output = this.input.replace(/\\u([\da-f]{4})/gi, (match, code) => 
                String.fromCharCode(parseInt(code, 16))
            );
        } catch (e) {
            this.output = 'Error: Invalid Unicode escape sequence';
        }
    }

    private toCodePoints() {
        this.output = Array.from(this.input)
            .map(char => `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
            .join(' ');
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input:</span>
                <t-textarea placeholder="Enter text or Unicode escapes..." rows="6" .value=${String(this.input)} @t-input=${this.handleInputChange}></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.toUnicode}>To Unicode (Non-ASCII only)</t-button>
                <t-button variant="blue" @click=${this.toUnicodeEscape}>To Unicode (All)</t-button>
                <t-button variant="blue" @click=${this.fromUnicode}>From Unicode</t-button>
                <t-button variant="blue" @click=${this.toCodePoints}>To Code Points</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <t-textarea rows="6" ?readonly=${true} class="font-mono text-sm"></t-textarea>
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
        'unicode-converter': UnicodeConverter;
    }
}
