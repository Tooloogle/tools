import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import checksumCalculatorStyles from './checksum-calculator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('checksum-calculator')
export class ChecksumCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, checksumCalculatorStyles];

    override render() {
        return html`
            <h2>
                checksum-calculator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'checksum-calculator': ChecksumCalculator;
    }
}
