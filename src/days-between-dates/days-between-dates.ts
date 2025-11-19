import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import daysBetweenDatesStyles from './days-between-dates.css.js';
import { customElement } from 'lit/decorators.js';

@customElement('days-between-dates')
export class DaysBetweenDates extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, daysBetweenDatesStyles];

    override render() {
        return html`
            <h2>
                days-between-dates
            </h2>
            Start updating the new tool
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'days-between-dates': DaysBetweenDates;
    }
}
