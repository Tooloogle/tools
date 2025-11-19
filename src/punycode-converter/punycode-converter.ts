import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import punycodeConverterStyles from './punycode-converter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('punycode-converter')
export class PunycodeConverter extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, punycodeConverterStyles];

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

        try {
            // Simple ASCII to Punycode-like conversion
            // Full punycode requires a library, this is a placeholder
            // TODO: [Package] Install 'punycode' package for proper conversion
            this.outputText = `xn--${  this.inputText.split('').map(c => c.charCodeAt(0)).join('')}`;
        } catch (err) {
            this.outputText = 'Error: Punycode conversion requires additional library';
        }
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Input Text:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter text to convert to punycode..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Punycode Output:</label>
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
        'punycode-converter': PunycodeConverter;
    }
}
