import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import certificateDecoderStyles from './certificate-decoder.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('certificate-decoder')
export class CertificateDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, certificateDecoderStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        // TODO: [Server/API] Certificate decoding requires X.509 parsing library
        this.outputText = 'Certificate decoding requires server-side X.509 parsing';
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
        'certificate-decoder': CertificateDecoder;
    }
}
