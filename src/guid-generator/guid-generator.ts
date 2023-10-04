import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import guidGeneratorStyles from './guid-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import "../t-copy-button/t-copy-button.js";
import buttonStyles from '../_styles/button.css.js';

@customElement('guid-generator')
export class GuidGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, guidGeneratorStyles];

    @property()
    guid = "";

    connectedCallback() {
        super.connectedCallback();
        this.guid = this.uuidv4();
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    override render() {
        return html`
            <input 
                class="form-input"
                readonly
                .value="${this.guid}"
                @change=${(e: any) => this.guid = e.target?.value} />

            <div class="py-2 text-right">
                <button class="btn btn-blue btn-sm" @click=${() => this.guid = this.uuidv4()}>Re-generate</button>
                <t-copy-button .isIcon=${false} .text=${this.guid}></t-copy-button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'guid-generator': GuidGenerator;
    }
}
