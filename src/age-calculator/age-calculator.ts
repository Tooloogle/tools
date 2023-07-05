import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import dayjs from 'dayjs/esm'
import duration from 'dayjs/esm/plugin/duration';
import { gridStyles } from '../_styles/grid.css.js';
import { inputStyles } from '../_styles/input.css.js';
import { ageCalculatorStyles } from './age-calculator.css.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import { marginUtilsStyles } from '../_styles/margin-utils.css.js';
import { utilsStyles } from '../_styles/utils.css.js';
import { buttonStyles } from '../_styles/button.css.js';
import { when } from 'lit/directives/when.js';
import { repeat } from 'lit/directives/repeat.js';
import { formatNumber } from '../_utils/NumberHelper.js';
import { tableStyles } from '../_styles/table.css.js';

dayjs.extend(duration);

@customElement('age-calculator')
export class AgeCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [gridStyles, inputStyles, buttonStyles, tableStyles, ageCalculatorStyles, marginUtilsStyles, utilsStyles];

    @property()
    haveTime = false;

    @property()
    today = "";

    @property()
    dob = "";

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
                // milliseconds: formatNumber(diff.asMilliseconds(), 0),
            }
        };
    }

    override render() {
        const { years, months, days, hours, minutes, seconds } = this.result;
        return html`
            ${when(this.result?.years !== undefined, () => html`
                <div class="row">
                    <div class="col result">
                        <div>
                            <div class="text-end">
                                <span class="btn-close" @click=${() => this.result = {}}>
                                    &times;
                                </span>
                            </div>
                            <h3 class="m-0">
                                Result
                            </h3>  
                            <p class="text-center">${`${years} year(s), ${months} month(s), ${days} day(s)`} 
                            ${this.haveTime ? `${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)` : ""}</p>
                            <table>
                                <tbody>
                                    ${repeat(Object.keys(this.result.total), (key) => html`
                                        <tr>
                                            <td style="text-transform: capitalize">${key}</td>
                                            <td class="text-end">${formatNumber(this.result.total[key], 0)}</td>
                                        </tr>
                                    `)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `)}
            <div class="row">
                <div class="col">
                    <label>Date Of Birth</label>
                    <input 
                        name="birthday"
                        class="my-2" type="${this.haveTime ? "datetime-local" : "date"}"
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        .value=${this.dob}
                        @change=${(e: any) => this.dob = e.target.value}
                        required />

                    <label>Age at the Date</label>
                    <input 
                        name="today"
                        class="my-2"
                        type="${this.haveTime ? "datetime-local" : "date"}"
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        .value=${this.today}
                        @change=${(e: any) => this.today = e.target.value}
                        required />

                    <div class="my-2">
                        <input id="haveTime" type="checkbox" @change=${(e: any) => this.haveTime = e.target.checked} />
                        <label for="haveTime">Have time?</label>
                    </div>
                </div>
            </div>
            <div class="text-end">
                <button .disabled=${!this.dob || !this.today} class="btn" @click=${this.calculate}>Calculate</button>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'age-calculator': AgeCalculator;
    }
}
