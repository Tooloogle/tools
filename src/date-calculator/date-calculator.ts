import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import dateCalculatorStyles from './date-calculator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('date-calculator')
export class DateCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, dateCalculatorStyles];

    override render() {
        return html`
            <h2>
                date-calculator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'date-calculator': DateCalculator;
    }
}
