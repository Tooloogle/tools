import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import openGraphGeneratorStyles from './open-graph-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('open-graph-generator')
export class OpenGraphGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, openGraphGeneratorStyles];

    override render() {
        return html`
            <h2>
                open-graph-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'open-graph-generator': OpenGraphGenerator;
    }
}
