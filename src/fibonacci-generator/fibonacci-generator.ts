import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import fibonacciGeneratorStyles from './fibonacci-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('fibonacci-generator')
export class FibonacciGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, fibonacciGeneratorStyles];

    override render() {
        return html`
            <h2>
                fibonacci-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'fibonacci-generator': FibonacciGenerator;
    }
}
