import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import unicodeConverterStyles from './unicode-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('unicode-converter')
export class UnicodeConverter extends WebComponentBase {
    static override styles = [WebComponentBase.styles, unicodeConverterStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private toUnicode() {
        this.output = Array.from(this.input)
            .map(char => {
                const code = char.codePointAt(0)!;
                if (code > 0xffff) return `\\u{${code.toString(16)}}`;
                return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
            })
            .join('');
    }

    private toUnicodeEscape() {
        this.output = Array.from(this.input)
            .map(char => {
                const code = char.codePointAt(0)!;
                if (code > 0xffff) return `\\u{${code.toString(16)}}`;
                return `\\u${code.toString(16).padStart(4, '0')}`;
            })
            .join('');
    }

    private fromUnicode() {
        try {
            this.output = this.input.replace(/\\u\{([\da-f]+)\}|\\u([\da-f]{4})/gi, (_match, codeExt, code4) => 
                String.fromCodePoint(parseInt(codeExt || code4, 16))
            );
        } catch (e) {
            this.output = 'Error: Invalid Unicode escape sequence';
        }
    }

    private toCodePoints() {
        this.output = Array.from(this.input)
            .map(char => `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`)
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
                <textarea
                    class="form-textarea"
                    placeholder="Enter text or Unicode escapes..."
                    rows="6"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.toUnicode}>To Unicode (Non-ASCII only)</button>
                <button class="btn btn-blue" @click=${this.toUnicodeEscape}>To Unicode (All)</button>
                <button class="btn btn-blue" @click=${this.fromUnicode}>From Unicode</button>
                <button class="btn btn-blue" @click=${this.toCodePoints}>To Code Points</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <textarea
                        class="form-textarea font-mono text-sm"
                        rows="6"
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
        'unicode-converter': UnicodeConverter;
    }
}
