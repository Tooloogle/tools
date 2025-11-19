import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import dataUriGeneratorStyles from './data-uri-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('data-uri-generator')
export class DataUriGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, dataUriGeneratorStyles];

    override render() {
        return html`
            <h2>
                data-uri-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'data-uri-generator': DataUriGenerator;
    }
}
