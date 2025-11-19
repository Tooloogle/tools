import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import whitespaceRemoverStyles from './whitespace-remover.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('whitespace-remover')
export class WhitespaceRemover extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, whitespaceRemoverStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
    }

    private removeAllWhitespace() {
        this.output = this.input.replace(/\s+/g, '');
    }

    private removeExtraWhitespace() {
        this.output = this.input.replace(/\s+/g, ' ').trim();
    }

    private removeLeadingTrailing() {
        this.output = this.input.split('\n').map(line => line.trim()).join('\n');
    }

    private removeBlankLines() {
        this.output = this.input.split('\n').filter(line => line.trim()).join('\n');
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
                    placeholder="Enter text with whitespace..."
                    rows="10"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.removeAllWhitespace}>Remove All Whitespace</button>
                <button class="btn btn-blue" @click=${this.removeExtraWhitespace}>Remove Extra Whitespace</button>
                <button class="btn btn-blue" @click=${this.removeLeadingTrailing}>Trim Lines</button>
                <button class="btn btn-blue" @click=${this.removeBlankLines}>Remove Blank Lines</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
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
        'whitespace-remover': WhitespaceRemover;
    }
}
