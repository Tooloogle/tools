import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textReverserStyles from './text-reverser.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/t-copy-button.js';
import '../t-button/t-button.js';
import '../t-textarea/t-textarea.js';

@customElement('text-reverser')
export class TextReverser extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, textReverserStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: CustomEvent) {
        this.input = e.detail.value;
    }

    private reverseText() {
        this.output = this.input.split('').reverse().join('');
    }

    private reverseWords() {
        this.output = this.input.split(' ').reverse().join(' ');
    }

    private reverseLines() {
        this.output = this.input.split('\n').reverse().join('\n');
    }

    private reverseEachWord() {
        this.output = this.input.split(' ').map(word => 
            word.split('').reverse().join('')
        ).join(' ');
    }

    private clear() {
        this.input = '';
        this.output = '';
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1 font-bold">Input Text:</span>
                <t-textarea placeholder="Enter text to reverse..." rows="6" .value=${String(this.input)} @t-input=${this.handleInputChange}></t-textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <t-button variant="blue" @click=${this.reverseText}>Reverse Text</t-button>
                <t-button variant="blue" @click=${this.reverseWords}>Reverse Words</t-button>
                <t-button variant="blue" @click=${this.reverseLines}>Reverse Lines</t-button>
                <t-button variant="blue" @click=${this.reverseEachWord}>Reverse Each Word</t-button>
                <t-button variant="red" @click=${this.clear}>Clear</t-button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <t-textarea rows="6" .value=${String(this.output)} ?readonly=${true}></t-textarea>
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
        'text-reverser': TextReverser;
    }
}
