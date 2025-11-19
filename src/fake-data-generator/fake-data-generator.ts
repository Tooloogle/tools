import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import fakeDataGeneratorStyles from './fake-data-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('fake-data-generator')
export class FakeDataGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, fakeDataGeneratorStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        // TODO: [Implementation] Generate fake data (names, emails, etc.)
        // This tool requires additional implementation
        this.outputText = this.inputText || 'Enter input to see results';
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
                    Note: Generate fake data (names, emails, etc.)
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'fake-data-generator': FakeDataGenerator;
    }
}
