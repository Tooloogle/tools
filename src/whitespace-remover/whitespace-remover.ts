import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import whitespaceRemoverStyles from './whitespace-remover.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-button';
import '../t-textarea';

@customElement('whitespace-remover')
export class WhitespaceRemover extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, whitespaceRemoverStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
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
                <t-textarea placeholder="Enter text with whitespace..." rows="10" .value=${String(this.input)} @t-input=${this.handleInputChange}></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.removeAllWhitespace}>Remove All Whitespace</t-button>
                <t-button variant="blue" @click=${this.removeExtraWhitespace}>Remove Extra Whitespace</t-button>
                <t-button variant="blue" @click=${this.removeLeadingTrailing}>Trim Lines</t-button>
                <t-button variant="blue" @click=${this.removeBlankLines}>Remove Blank Lines</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <t-textarea rows="10" .value=${String(this.output)} ?readonly=${true}></t-textarea>
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
