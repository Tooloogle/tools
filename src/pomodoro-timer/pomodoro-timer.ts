import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import pomodoroTimerStyles from './pomodoro-timer.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('pomodoro-timer')
export class PomodoroTimer extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, pomodoroTimerStyles];

    override render() {
        return html`
            <h2>
                pomodoro-timer
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'pomodoro-timer': PomodoroTimer;
    }
}
