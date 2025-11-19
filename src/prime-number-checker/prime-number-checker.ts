import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import primeNumberCheckerStyles from './prime-number-checker.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('prime-number-checker')
export class PrimeNumberChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, primeNumberCheckerStyles];

    override render() {
        return html`
            <h2>
                prime-number-checker
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'prime-number-checker': PrimeNumberChecker;
    }
}
