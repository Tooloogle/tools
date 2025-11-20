import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import textHighlighterStyles from './text-highlighter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('text-highlighter')
export class TextHighlighter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, textHighlighterStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        if (!this.inputText) {
            this.outputText = '';
            return;
        }
        
        const lines = this.inputText.split('\n');
        if (lines.length < 2) {
            this.outputText = this.inputText;
            return;
        }
        
        const searchTerm = lines[0];
        const text = lines.slice(1).join('\n');
        
        if (!searchTerm) {
            this.outputText = text;
            return;
        }
        
        const highlighted = text.replace(new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), 
            match => `**${match}**`);
        
        this.outputText = highlighted;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Input:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter input..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Output:</label>
                    <textarea
                        class="form-input w-full h-32"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                    ${this.outputText ? html`<t-copy-button .text=${this.outputText}></t-copy-button>` : ''}
                </div>
                <div class="text-sm text-gray-600">
                    Note: Highlight search terms in text
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'text-highlighter': TextHighlighter;
    }
}
