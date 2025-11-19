import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import certificateDecoderStyles from './certificate-decoder.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('certificate-decoder')
export class CertificateDecoder extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, certificateDecoderStyles];

    override render() {
        return html`
            <h2>
                certificate-decoder
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'certificate-decoder': CertificateDecoder;
    }
}
