import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import checksumCalculatorStyles from './checksum-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('checksum-calculator')
export class ChecksumCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, checksumCalculatorStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        // TODO: [API] Various checksum algorithms (CRC32, etc.) need crypto libraries
        this.outputText = 'Checksum calculation requires additional crypto libraries';
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
                        class="form-input w-full h-32 bg-yellow-50"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'checksum-calculator': ChecksumCalculator;
    }
}
