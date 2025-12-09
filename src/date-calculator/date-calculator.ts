import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import dateCalculatorStyles from './date-calculator.css.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import dayjs from 'dayjs';
import '../t-input';

@customElement('date-calculator')
export class DateCalculator extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, dateCalculatorStyles];

  @property() startDate = '';
  @property({ type: Number }) years = 0;
  @property({ type: Number }) months = 0;
  @property({ type: Number }) days = 0;
  @property({ type: String }) operation = 'add';
  @property({ type: String }) resultDate = '';

  private calculate() {
    if (!this.startDate) {
      this.resultDate = '';
      return;
    }

    let result = dayjs(this.startDate);
    
    if (this.operation === 'add') {
      result = result.add(this.years, 'year').add(this.months, 'month').add(this.days, 'day');
    } else {
      result = result.subtract(this.years, 'year').subtract(this.months, 'month').subtract(this.days, 'day');
    }
    
    this.resultDate = result.format('YYYY-MM-DD');
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Start Date:</label>
          <t-input type="date" class="w-full"></t-input> { this.startDate = e.detail.value; this.calculate(); }}
            required />
        </div>
        <div>
          <label class="block mb-2 font-semibold">Operation:</label>
          <select class="form-input w-full" .value=${this.operation}
            @change=${(e: CustomEvent) => { this.operation = e.detail.value; this.calculate(); }}>
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block mb-2 font-semibold">Years:</label>
            <t-input type="number" class="w-full"></t-input> { this.years = Number(e.detail.value); this.calculate(); }} />
          </div>
          <div>
            <label class="block mb-2 font-semibold">Months:</label>
            <t-input type="number" class="w-full"></t-input> { this.months = Number(e.detail.value); this.calculate(); }} />
          </div>
          <div>
            <label class="block mb-2 font-semibold">Days:</label>
            <t-input type="number" class="w-full"></t-input> { this.days = Number(e.detail.value); this.calculate(); }} />
          </div>
        </div>
        ${this.resultDate ? html`
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600 mb-1">Result Date:</div>
            <div class="text-2xl font-bold text-green-600">${this.resultDate}</div>
            <t-copy-button .text=${this.resultDate}></t-copy-button>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'date-calculator': DateCalculator;
  }
}