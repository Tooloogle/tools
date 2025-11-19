import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import palindromeCheckerStyles from './palindrome-checker.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('palindrome-checker')
export class PalindromeChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, palindromeCheckerStyles];

    override render() {
        return html`
            <h2>
                palindrome-checker
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'palindrome-checker': PalindromeChecker;
    }
}
