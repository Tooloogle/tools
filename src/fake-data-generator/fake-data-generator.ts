import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import fakeDataGeneratorStyles from './fake-data-generator.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('fake-data-generator')
export class FakeDataGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, fakeDataGeneratorStyles];

    override render() {
        return html`
            <h2>
                fake-data-generator
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'fake-data-generator': FakeDataGenerator;
    }
}
