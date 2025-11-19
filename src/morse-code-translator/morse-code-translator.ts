import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import morseCodeTranslatorStyles from './morse-code-translator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('morse-code-translator')
export class MorseCodeTranslator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, morseCodeTranslatorStyles];

    override render() {
        return html`
            <h2>
                morse-code-translator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'morse-code-translator': MorseCodeTranslator;
    }
}
