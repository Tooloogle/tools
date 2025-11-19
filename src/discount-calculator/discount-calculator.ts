import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import discountCalculatorStyles from './discount-calculator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('discount-calculator')
export class DiscountCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, discountCalculatorStyles];

    override render() {
        return html`
            <h2>
                discount-calculator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'discount-calculator': DiscountCalculator;
    }
}
