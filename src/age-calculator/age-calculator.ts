import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ageCalculatorStyles from './age-calculator.css.js';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { formatNumber } from '../_utils/NumberHelper.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import '../t-input';
import '../t-checkbox';
import '../t-button/t-button.js';

dayjs.extend(duration);

@customElement('age-calculator')
export class AgeCalculator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    ageCalculatorStyles];

  @property()
  haveTime = false;

  @property()
  today = '';

  @property()
  dob = '';

  @property()
  result: any = {};

  calculate() {
    // TODO: fix the date diff either in dayjs or use another lib or write our own code to calculate date diff
    /*
            day js fixes
            inside parseFromMilliseconds

            var $ms = this.$ms;
            var years = roundNumber($ms / MILLISECONDS_A_YEAR);
            var msInYear = MILLISECONDS_A_YEAR;
            var msInMonth = MILLISECONDS_A_MONTH;
            var leapYears = roundNumber(years / 4);
            if (leapYears) {
                msInYear = MILLISECONDS_A_DAY * 365.25;
                msInMonth = msInYear / 12;
            }

            this.$d.years = roundNumber($ms / msInYear);
            $ms %= msInYear;
            this.$d.months = roundNumber($ms / msInMonth);
            $ms %= msInMonth;
         */

    const today = dayjs(this.today);
    const dob = dayjs(this.dob);
    const diff = dayjs.duration(today.diff(dob, undefined, true));
    this.result = {
      days: diff.days(),
      months: diff.months(),
      years: diff.years(),
      hours: diff.hours(),
      minutes: diff.minutes(),
      seconds: diff.seconds(),
      milliseconds: diff.milliseconds(),
      total: {
        days: diff.asDays(),
        months: diff.asMonths().toFixed(0),
        weeks: diff.asWeeks().toFixed(0),
        years: Math.floor(diff.asYears()),
        hours: diff.asHours(),
        minutes: diff.asMinutes(),
        seconds: diff.asSeconds(),
        // milliseconds: diff.asMilliseconds(),
      },
    };
  }

  private handleDobChange(e: CustomEvent) {
    this.dob = e.detail.value;
  }

  private handleTodayChange(e: CustomEvent) {
    this.today = e.detail.value;
  }

  private handleHaveTimeChange(e: CustomEvent) {
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
                <h3 class="m-0">Result</h3>
                <p class="text-center">
                  ${`${years} year(s), ${months} month(s), ${days} day(s)`}
                  ${this.haveTime
                    ? `${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)`
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
          <span>Date Of Birth</span>
          <t-input
            name="birthday"
            .type=${this.haveTime ? 'datetime-local' : 'date'}
            .value=${this.dob}
            @t-input=${this.handleDobChange}
            required
          ></t-input>
        </label>
        <label class="block">
          <span>Age at the Date</span>
          <t-input
            name="today"
            .type=${this.haveTime ? 'datetime-local' : 'date'}
            .value=${this.today}
            @t-input=${this.handleTodayChange}
            required
          ></t-input>
        </label>
        <t-checkbox
          id="haveTime"
          label="Have time?"
          .checked=${this.haveTime}
          @t-change=${this.handleHaveTimeChange}
        ></t-checkbox>
      </div>
      <div class="text-end">
        <t-button variant="blue" ?disabled=${true}>
          Calculate
        </t-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'age-calculator': AgeCalculator;
  }
}
