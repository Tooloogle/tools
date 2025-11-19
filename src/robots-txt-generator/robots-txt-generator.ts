import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import robotsTxtGeneratorStyles from './robots-txt-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('robots-txt-generator')
export class RobotsTxtGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, robotsTxtGeneratorStyles];

    override render() {
        return html`
            <h2>
                robots-txt-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'robots-txt-generator': RobotsTxtGenerator;
    }
}
