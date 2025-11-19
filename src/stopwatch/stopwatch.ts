import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import stopwatchStyles from './stopwatch.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('stopwatch')
export class Stopwatch extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, stopwatchStyles];

    override render() {
        return html`
            <h2>
                stopwatch
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'stopwatch': Stopwatch;
    }
}
