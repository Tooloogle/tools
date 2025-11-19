import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import worldClockStyles from './world-clock.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('world-clock')
export class WorldClock extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, worldClockStyles];

    override render() {
        return html`
            <h2>
                world-clock
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'world-clock': WorldClock;
    }
}
