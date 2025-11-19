import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import qrCodeReaderStyles from './qr-code-reader.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('qr-code-reader')
export class QrCodeReader extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, qrCodeReaderStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        // TODO: [Browser] QR code reading requires camera API and image processing library
        // Consider using jsQR library
        this.outputText = 'QR code reading requires camera access and image processing library';
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
        'qr-code-reader': QrCodeReader;
    }
}
