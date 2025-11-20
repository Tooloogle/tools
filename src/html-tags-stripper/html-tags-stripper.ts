import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlTagsStripperStyles from './html-tags-stripper.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('html-tags-stripper')
export class HtmlTagsStripper extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, htmlTagsStripperStyles];

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

        // Strip HTML tags
        this.outputText = this.inputText.replace(/<[^>]*>/g, '');
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">HTML Input:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter HTML to strip tags..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Plain Text Output:</label>
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
        'html-tags-stripper': HtmlTagsStripper;
    }
}
