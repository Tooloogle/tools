import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import qrCodeReaderStyles from './qr-code-reader.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('qr-code-reader')
export class QrCodeReader extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, qrCodeReaderStyles];

    override render() {
        return html`
            <h2>
                qr-code-reader
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'qr-code-reader': QrCodeReader;
    }
}
