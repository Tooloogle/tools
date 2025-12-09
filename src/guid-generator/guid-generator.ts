import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import guidGeneratorStyles from './guid-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import "../t-copy-button/t-copy-button.js";
import '../t-button/t-button.js';
import '../t-input/t-input.js';

@customElement('guid-generator')
export class GuidGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, guidGeneratorStyles];

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

    private onGuidChange(e: CustomEvent) {
        this.guid = e.detail.value;
    }

    private regenerateGuid() {
        this.guid = this.uuidv4();
    }

    override render() {
        return html`
            <t-input @t-change=${this.onGuidChange} ?readonly=${true}></t-input>

              <div class="py-2 text-right">
                <t-button variant="blue" class="btn-sm">Re-generate</t-button>
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
