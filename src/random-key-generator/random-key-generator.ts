import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import randomKeyGeneratorStyles from './random-key-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('random-key-generator')
export class RandomKeyGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, randomKeyGeneratorStyles];

    override render() {
        return html`
            <h2>
                random-key-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'random-key-generator': RandomKeyGenerator;
    }
}
