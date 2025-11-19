import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import gradientTextGeneratorStyles from './gradient-text-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('gradient-text-generator')
export class GradientTextGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, gradientTextGeneratorStyles];

    override render() {
        return html`
            <h2>
                gradient-text-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'gradient-text-generator': GradientTextGenerator;
    }
}
