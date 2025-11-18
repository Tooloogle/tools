import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textReverserStyles from './text-reverser.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import '../t-copy-button/t-copy-button.js';

@customElement('text-reverser')
export class TextReverser extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, textReverserStyles];

    @property()
    input = '';

    @property()
    output = '';

    private handleInputChange(e: Event) {
        this.input = (e.target as HTMLTextAreaElement).value;
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
                <textarea
                    class="form-textarea"
                    placeholder="Enter text to reverse..."
                    rows="6"
                    autofocus
                    .value=${this.input}
                    @input=${this.handleInputChange}
                ></textarea>
            </label>

            <div class="py-2 flex flex-wrap gap-2">
                <button class="btn btn-blue" @click=${this.reverseText}>Reverse Text</button>
                <button class="btn btn-blue" @click=${this.reverseWords}>Reverse Words</button>
                <button class="btn btn-blue" @click=${this.reverseLines}>Reverse Lines</button>
                <button class="btn btn-blue" @click=${this.reverseEachWord}>Reverse Each Word</button>
                <button class="btn btn-red" @click=${this.clear}>Clear</button>
            </div>

            ${this.output ? html`
                <label class="block py-1">
                    <span class="inline-block py-1 font-bold">Output:</span>
                    <textarea
                        class="form-textarea"
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
        'text-reverser': TextReverser;
    }
}
