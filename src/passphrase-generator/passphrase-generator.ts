import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import passphraseGeneratorStyles from './passphrase-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('passphrase-generator')
export class PassphraseGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, passphraseGeneratorStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        const wordCount = parseInt(this.inputText) || 4;
        const words = ['correct', 'horse', 'battery', 'staple', 'monkey', 'dragon', 'wizard', 'castle', 
                      'ocean', 'mountain', 'forest', 'river', 'thunder', 'lightning', 'phoenix', 'tiger'];
        
        const result = [];
        for (let i = 0; i < wordCount; i++) {
            const idx = Math.floor(Math.random() * words.length);
            result.push(words[idx]);
        }
        
        this.outputText = result.join('-');
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Number of Words:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter number of words (default: 4)..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Generated Passphrase:</label>
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
        'passphrase-generator': PassphraseGenerator;
    }
}
