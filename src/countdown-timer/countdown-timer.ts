import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import countdownTimerStyles from './countdown-timer.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('countdown-timer')
export class CountdownTimer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, countdownTimerStyles];

    override render() {
        return html`
            <h2>
                countdown-timer
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'countdown-timer': CountdownTimer;
    }
}
