import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import barcodeGeneratorStyles from './barcode-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('barcode-generator')
export class BarcodeGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, barcodeGeneratorStyles];

    override render() {
        return html`
            <h2>
                barcode-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'barcode-generator': BarcodeGenerator;
    }
}
