import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textToLeetspeakStyles from './text-to-leetspeak.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('text-to-leetspeak')
export class TextToLeetspeak extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, textToLeetspeakStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.convert();
    }

    private convert() {
        const leet: {[key: string]: string} = {
            'a': '4', 'e': '3', 'i': '1', 'o': '0', 't': '7', 's': '5', 'g': '9', 'b': '8'
        };
        this.outputText = this.inputText.toLowerCase().split('').map(c => leet[c] || c).join('');
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Input Text:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter text to convert to leetspeak..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">L33t Sp34k Output:</label>
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
        'text-to-leetspeak': TextToLeetspeak;
    }
}
