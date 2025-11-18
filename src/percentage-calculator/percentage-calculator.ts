import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import percentageCalculatorStyles from './percentage-calculator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('percentage-calculator')
export class PercentageCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, percentageCalculatorStyles];

    override render() {
        return html`
            <h2>
                percentage-calculator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'percentage-calculator': PercentageCalculator;
    }
}
