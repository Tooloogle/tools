import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ageDifferenceCalculatorStyles from './age-difference-calculator.css.js';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { formatNumber } from '../_utils/NumberHelper.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import '../t-button/t-button.js';
import '../t-input/t-input.js';

dayjs.extend(duration);

@customElement('age-difference-calculator')
export class AgeDifferenceCalculator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    ageDifferenceCalculatorStyles];

  @property()
  haveTime = false;

  @property()
  date1 = '';

  @property()
  date2 = '';

  @property()
  result: any = {};

  calculate() {
    const firstDate = dayjs(this.date1);
    const secondDate = dayjs(this.date2);
    const diff = dayjs.duration(Math.abs(secondDate.diff(firstDate, undefined, true)));
    
    this.result = {
      days: diff.days(),
      months: diff.months(),
      years: diff.years(),
      hours: diff.hours(),
      minutes: diff.minutes(),
      seconds: diff.seconds(),
      milliseconds: diff.milliseconds(),
      total: {
        days: Math.abs(diff.asDays()),
        months: Math.abs(diff.asMonths()).toFixed(0),
        weeks: Math.abs(diff.asWeeks()).toFixed(0),
        years: Math.floor(Math.abs(diff.asYears())),
        hours: Math.abs(diff.asHours()),
        minutes: Math.abs(diff.asMinutes()),
        seconds: Math.abs(diff.asSeconds()),
      },
    };
  }

  private handleDate1Change(e: CustomEvent) {
    this.date1 = e.detail.value;
  }

  private handleDate2Change(e: CustomEvent) {
    this.date2 = e.detail.value;
  }

  private handleHaveTimeChange(e: Event) {
    this.haveTime = (e.target as HTMLInputElement).checked;
  }

  private clearResult() {
    this.result = {};
  }

  // eslint-disable-next-line max-lines-per-function
  override render() {
    const { years, months, days, hours, minutes, seconds } = this.result;
    return html`
      ${when(
        this.result?.years !== undefined,
        () => html`
          <div class="flex justify-center">
            <div class="result mb-5">
              <div class="p-3 rounded-md shadow-md">
                <div class="text-end">
                  <span class="btn-close" @click=${this.clearResult}>
                    &times;
                  </span>
                </div>
                <h3 class="m-0">Age Difference</h3>
                <p class="text-center">
                  ${`${years} year(s), ${months} month(s), ${days} day(s)`}
                  ${this.haveTime
                    ? `, ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)`
                    : ''}
                </p>

                <table class="w-full table table-auto border-collapse">
                  <tbody>
                    ${repeat(
                      Object.keys(this.result.total),
                      key => html`
                        <tr
                          class="border-0 border-t border-solid dark:border-gray-700"
                        >
                          <td class="px-6 py-2 dark:text-gray-400 capitalize">
                            ${key}
                          </td>
                          <td class="px-6 py-2 text-end">
                            ${formatNumber(this.result.total[key], 0)}
                          </td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `
      )}

      <div class="grid grid-cols-1 gap-4 dark:bg-gray-600">
        <label class="block">
          <span>First Date</span>
          <t-input type="${this.haveTime ? 'datetime-local' : 'date'}" ?required=${true}></t-input>
        </label>
        <label class="block">
          <span>Second Date</span>
          <t-input type="${this.haveTime ? 'datetime-local' : 'date'}" ?required=${true}></t-input>
        </label>
        <label class="block">
          <input
            id="haveTime"
            type="checkbox"
            @change=${this.handleHaveTimeChange}
          />
          <span>Have time?</span>
        </label>
      </div>
      <div class="text-end">
        <t-button variant="blue">
          Calculate Difference
        </t-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'age-difference-calculator': AgeDifferenceCalculator;
  }
}
