import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import leapYearCheckerStyles from './leap-year-checker.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';

@customElement('leap-year-checker')
export class LeapYearChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, leapYearCheckerStyles];

    @property()
    year = new Date().getFullYear();

    @property()
    isLeap = false;

    @property()
    checked = false;

    private isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    private getDaysInFebruary(year: number): number {
        return this.isLeapYear(year) ? 29 : 28;
    }

    private handleYearChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.year = parseInt(target.value, 10) || new Date().getFullYear();
    }

    private checkYear() {
        this.isLeap = this.isLeapYear(this.year);
        this.checked = true;
    }

    private getNextLeapYear(year: number): number {
        let next = year + 1;
        while (!this.isLeapYear(next)) {
            next++;
        }
        return next;
    }

    private getPreviousLeapYear(year: number): number {
        let prev = year - 1;
        while (!this.isLeapYear(prev)) {
            prev--;
        }
        return prev;
    }

    override render() {
        const nextLeap = this.getNextLeapYear(this.year);
        const prevLeap = this.getPreviousLeapYear(this.year);

        return html`
            <div class="space-y-4">
                <label class="block">
                    <span class="inline-block py-1">Enter a year</span>
                    <input
                        type="number"
                        class="form-input text-center"
                        .value=${this.year.toString()}
                        @input=${this.handleYearChange}
                        placeholder="Enter year"
                        min="1"
                        max="9999"
                        autofocus
                    />
                </label>

                <div class="text-center">
                    <button class="btn btn-blue" @click=${this.checkYear}>
                        Check Leap Year
                    </button>
                </div>

                ${this.checked ? html`
                    <div class="p-6 rounded-lg text-center ${this.isLeap ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}">
                        <div class="text-4xl mb-2">${this.isLeap ? '✓' : '✗'}</div>
                        <div class="text-2xl font-bold ${this.isLeap ? 'text-green-700' : 'text-red-700'}">
                            ${this.year} ${this.isLeap ? 'IS' : 'IS NOT'} a Leap Year
                        </div>
                        <div class="mt-4 text-lg ${this.isLeap ? 'text-green-600' : 'text-red-600'}">
                            February ${this.year} has ${this.getDaysInFebruary(this.year)} days
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-gray-100 rounded">
                            <div class="font-semibold text-gray-700">Previous Leap Year</div>
                            <div class="text-2xl text-blue-600">${prevLeap}</div>
                        </div>
                        <div class="p-4 bg-gray-100 rounded">
                            <div class="font-semibold text-gray-700">Next Leap Year</div>
                            <div class="text-2xl text-blue-600">${nextLeap}</div>
                        </div>
                    </div>

                    <div class="p-4 bg-blue-50 rounded border border-blue-200">
                        <div class="font-semibold text-blue-900 mb-2">Leap Year Rules</div>
                        <ul class="text-sm text-blue-700 space-y-1 list-disc list-inside">
                            <li>Divisible by 4 → Usually a leap year</li>
                            <li>Divisible by 100 → Not a leap year</li>
                            <li>Divisible by 400 → Always a leap year</li>
                        </ul>
                        <div class="mt-3 text-xs text-blue-600">
                            Example: 2000 was a leap year (divisible by 400), but 1900 was not (divisible by 100 but not 400).
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'leap-year-checker': LeapYearChecker;
    }
}
