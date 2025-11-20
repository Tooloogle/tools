import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import daysBetweenDatesStyles from './days-between-dates.css.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import buttonStyles from '../_styles/button.css.js';
import inputStyles from '../_styles/input.css.js';
import dayjs from 'dayjs';

@customElement('days-between-dates')
export class DaysBetweenDates extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, daysBetweenDatesStyles];

  @property() date1 = '';
  @property() date2 = '';
  @property({ type: Number }) daysDiff = 0;
  @property({ type: Number }) weeksDiff = 0;
  @property({ type: Number }) monthsDiff = 0;
  @property({ type: Number }) yearsDiff = 0;

  private calculate() {
    if (!this.date1 || !this.date2) {
      this.daysDiff = 0;
      return;
    }

    const d1 = dayjs(this.date1);
    const d2 = dayjs(this.date2);
    
    this.daysDiff = Math.abs(d2.diff(d1, 'day'));
    this.weeksDiff = Math.abs(d2.diff(d1, 'week', true));
    this.monthsDiff = Math.abs(d2.diff(d1, 'month', true));
    this.yearsDiff = Math.abs(d2.diff(d1, 'year', true));
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 font-semibold">First Date:</label>
            <input name="date1" class="form-input w-full" type="date"
              .value=${this.date1}
              @change=${(e: Event) => { this.date1 = (e.target as HTMLInputElement).value; this.calculate(); }}
              required />
          </div>
          <div>
            <label class="block mb-2 font-semibold">Second Date:</label>
            <input name="date2" class="form-input w-full" type="date"
              .value=${this.date2}
              @change=${(e: Event) => { this.date2 = (e.target as HTMLInputElement).value; this.calculate(); }}
              required />
          </div>
        </div>
        ${this.daysDiff > 0 ? html`
          <div class="bg-blue-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-semibold">Days:</span>
              <span class="text-xl font-bold text-blue-600">${this.daysDiff}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Weeks:</span>
              <span class="text-lg">${this.weeksDiff.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Months:</span>
              <span class="text-lg">${this.monthsDiff.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Years:</span>
              <span class="text-lg">${this.yearsDiff.toFixed(2)}</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'days-between-dates': DaysBetweenDates;
  }
}