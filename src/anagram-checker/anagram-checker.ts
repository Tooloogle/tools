import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import anagramCheckerStyles from './anagram-checker.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('anagram-checker')
export class AnagramChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, anagramCheckerStyles];

    override render() {
        return html`
            <h2>
                anagram-checker
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'anagram-checker': AnagramChecker;
    }
}
