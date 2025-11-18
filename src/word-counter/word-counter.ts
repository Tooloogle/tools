import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import wordCounterStyles from './word-counter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('word-counter')
export class WordCounter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, wordCounterStyles];

    @property()
    text = '';

    @property()
    wordCount = 0;

    @property()
    charCount = 0;

    @property()
    charCountNoSpaces = 0;

    @property()
    lineCount = 0;

    @property()
    sentenceCount = 0;

    @property()
    paragraphCount = 0;

    private handleTextChange(e: Event) {
        this.text = (e.target as HTMLTextAreaElement).value;
        this.updateCounts();
    }

    private updateCounts() {
        this.charCount = this.text.length;
        this.charCountNoSpaces = this.text.replace(/\s/g, '').length;
        this.lineCount = this.text ? this.text.split('\n').length : 0;
        
        // Count words (any sequence of non-whitespace characters)
        const words = this.text.trim().split(/\s+/);
        this.wordCount = this.text.trim() ? words.length : 0;
        
        // Count sentences (ending with . ! ?)
        const sentences = this.text.match(/[.!?]+/g);
        this.sentenceCount = sentences ? sentences.length : 0;
        
        // Count paragraphs (separated by blank lines)
        const paragraphs = this.text.split(/\n\s*\n/).filter(p => p.trim());
        this.paragraphCount = paragraphs.length;
    }

    override render() {
        return html`
            <label class="block py-1">
                <span class="inline-block py-1">Enter your text:</span>
                <textarea
                    class="form-textarea"
                    placeholder="Type or paste your text here..."
                    rows="10"
                    autofocus
                    .value=${this.text}
                    @input=${this.handleTextChange}
                ></textarea>
            </label>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div class="p-4 bg-gray-100 rounded">
                    <div class="text-2xl font-bold">${this.wordCount}</div>
                    <div class="text-sm text-gray-600">Words</div>
                </div>
                <div class="p-4 bg-gray-100 rounded">
                    <div class="text-2xl font-bold">${this.charCount}</div>
                    <div class="text-sm text-gray-600">Characters</div>
                </div>
                <div class="p-4 bg-gray-100 rounded">
                    <div class="text-2xl font-bold">${this.charCountNoSpaces}</div>
                    <div class="text-sm text-gray-600">Characters (no spaces)</div>
                </div>
                <div class="p-4 bg-gray-100 rounded">
                    <div class="text-2xl font-bold">${this.lineCount}</div>
                    <div class="text-sm text-gray-600">Lines</div>
                </div>
                <div class="p-4 bg-gray-100 rounded">
                    <div class="text-2xl font-bold">${this.sentenceCount}</div>
                    <div class="text-sm text-gray-600">Sentences</div>
                </div>
                <div class="p-4 bg-gray-100 rounded">
                    <div class="text-2xl font-bold">${this.paragraphCount}</div>
                    <div class="text-sm text-gray-600">Paragraphs</div>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'word-counter': WordCounter;
    }
}
