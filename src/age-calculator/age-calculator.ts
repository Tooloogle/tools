import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ageCalculatorStyles from './age-calculator.css.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import buttonStyles from '../_styles/button.css.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { formatNumber } from '../_utils/NumberHelper.js';
import inputStyles from '../_styles/input.css.js';
import dayjs from '../_utils/dayjs-ssr-helper/dayjs.js';
import duration from '../_utils/dayjs-ssr-helper/duration.js';

dayjs.extend(duration);
interface AgeResult {
  days: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  total: {
    days: number;
    months: string;
    weeks: string;
    years: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}
@customElement('age-calculator')
export class AgeCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, ageCalculatorStyles];

    @property()
    haveTime = false;

    @property()
    today = "";

    @property()
    dob = "";

    @property()
    result: Partial<AgeResult> | null = null;

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
            }
        };
    }

    private onDobChange(e: Event) {
    this.dob = (e.target as HTMLInputElement).value;
    }

    private onTodayChange(e: Event) {
        this.today = (e.target as HTMLInputElement).value;
    }

    private onHaveTimeChange(e: Event) {
        this.haveTime = (e.target as HTMLInputElement).checked;
    }

    private clearResult() {
        this.result = {};
    }

    // eslint-disable-next-line max-lines-per-function
    override render() {
        const { years, months, days, hours, minutes, seconds } = this.result;
        return html`
            ${when(this.result?.years !== undefined, () => html`
                <div class="flex justify-center">
                    <div class="result mb-5">
                        <div class="p-3 rounded-md shadow-md">
                            <div class="text-end">
                            <span class="btn-close" @click=${this.clearResult}>
                                &times;
                            </span>
                            </div>
                            <h3 class="m-0">
                                Result
                            </h3>  
                            <p class="text-center">${`${years} year(s), ${months} month(s), ${days} day(s)`} 
                            ${this.haveTime ? `${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)` : ""}</p>

                            <table class="w-full table table-auto border-collapse">
                                <tbody>
                                    ${repeat(Object.keys(this.result.total), (key) => html`
                                        <tr class="border-0 border-t border-solid dark:border-gray-700">
                                            <td class="px-6 py-2 dark:text-gray-400 capitalize">${key}</td>
                                            <td class="px-6 py-2 text-end">${formatNumber(this.result.total[key], 0)}</td>
                                        </tr>
                                    `)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `)}
            
            <div class="grid grid-cols-1 gap-4 dark:bg-gray-600">
                <label class="block">
                    <span>Date Of Birth</span>
                    <input 
                        name="birthday"
                        class="form-input" 
                        type="${this.haveTime ? "datetime-local" : "date"}"
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        .value=${this.dob}
                        @change=${this.onDobChange}
                        required />
                </label>
                <label class="block">
                    <span>Age at the Date</span>
                    <input 
                        name="today"
                        class="form-input" 
                        type="${this.haveTime ? "datetime-local" : "date"}"
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        .value=${this.today}
                        @change=${this.onTodayChange}
                        required />
                </label>
                <label class="block">
                    <input id="haveTime" type="checkbox" @change=${this.onHaveTimeChange} />
                    <span>Have time?</span>
                </label>
            </div>
            <div class="text-end">
                <button .disabled=${!this.dob || !this.today} class="btn btn-blue" @click=${this.calculate}>Calculate</button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'age-calculator': AgeCalculator;
    }
}
