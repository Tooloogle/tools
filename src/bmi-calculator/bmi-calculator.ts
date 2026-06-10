import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import bmiCalculatorStyles from './bmi-calculator.css.js';
import {
  validateInput,
  calculateBMIValue,
  getBMICategory,
  getCategoryClass, // Import the new Tailwind class function
} from './bmi-calculator-utils.js';

@customElement('bmi-calculator')
export class BmiCalculator extends WebComponentBase {
  static override styles = [WebComponentBase.styles, bmiCalculatorStyles];

  @property({ type: Number }) height = 0;
  @property({ type: Number }) weight = 0;
  @property({ type: Number }) bmi = 0;
  @property({ type: String }) category = '';
  @property({ type: String }) unit = 'metric';
  @property({ type: String }) heightError = '';
  @property({ type: String }) weightError = '';
  @property({ type: Boolean }) hasErrors = false;
  @property({ type: String }) heightInputValue = '';
  @property({ type: String }) weightInputValue = '';

  private updateErrorState() {
    this.hasErrors = !!(this.heightError || this.weightError);
  }

  private clearResults() {
    this.bmi = 0;
    this.category = '';
  }

  private calculateBMI() {
    try {
      // Only calculate if we have valid inputs and no errors
      if (this.height > 0 && this.weight > 0 && !this.hasErrors) {
        this.bmi = calculateBMIValue(this.height, this.weight, this.unit);
        this.category = getBMICategory(this.bmi);
      } else {
        this.clearResults();
      }
    } catch (error) {
      console.error('BMI calculation error:', error);
      this.clearResults();
    }
  }

  private handleHeightChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = parseFloat(input.value);

    this.heightInputValue = input.value;
    this.heightError = '';

    if (input.value.trim() === '') {
      this.height = 0;
      this.clearResults();
    } else if (isNaN(value)) {
      this.heightError = 'Please enter a valid number';
      this.height = 0;
      this.clearResults();
    } else {
      const validation = validateInput(value, 'height', this.unit);
      if (validation.isValid) {
        this.height = value;
      } else {
        this.heightError = validation.error || '';
        this.height = 0;
        this.clearResults();
      }
    }

    this.updateErrorState();
    if (!this.hasErrors) {
      this.calculateBMI();
    }
  }

  private handleWeightChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = parseFloat(input.value);

    this.weightInputValue = input.value;
    this.weightError = '';

    if (input.value.trim() === '') {
      this.weight = 0;
      this.clearResults();
    } else if (isNaN(value)) {
      this.weightError = 'Please enter a valid number';
      this.weight = 0;
      this.clearResults();
    } else {
      const validation = validateInput(value, 'weight', this.unit);
      if (validation.isValid) {
        this.weight = value;
      } else {
        this.weightError = validation.error || '';
        this.weight = 0;
        this.clearResults();
      }
    }

    this.updateErrorState();
    if (!this.hasErrors) {
      this.calculateBMI();
    }
  }

  private handleUnitChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.unit = select.value;

    this.heightError = '';
    this.weightError = '';

    if (this.heightInputValue && this.height > 0) {
      const heightValidation = validateInput(this.height, 'height', this.unit);
      if (!heightValidation.isValid) {
        this.heightError = heightValidation.error || '';
        this.height = 0;
      }
    }

    if (this.weightInputValue && this.weight > 0) {
      const weightValidation = validateInput(this.weight, 'weight', this.unit);
      if (!weightValidation.isValid) {
        this.weightError = weightValidation.error || '';
        this.weight = 0;
      }
    }

    this.updateErrorState();
    this.calculateBMI();
  }

  private renderErrorMessage(error: string) {
    return error
      ? html`<div class="text-sm font-medium text-red-600 dark:text-red-400">
          ${error}
        </div>`
      : '';
  }

  private renderUnitSelector() {
    return html`
      <label class="flex flex-col gap-1 w-full">
        <span class="block mb-1 text-sm font-medium">Unit System</span>
        <select class="form-input" @change="${this.handleUnitChange}">
          <option value="metric" ?selected="${this.unit === 'metric'}">
            Metric (cm/kg)
          </option>
          <option value="imperial" ?selected="${this.unit === 'imperial'}">
            Imperial (ft/lbs)
          </option>
        </select>
      </label>
    `;
  }

  private renderHeightInput() {
    return html`
      <label class="flex flex-col gap-1 w-full">
        <span class="block mb-1 text-sm font-medium"
          >Height (${this.unit === 'metric' ? 'cm' : 'ft'})</span
        >
        <input
          type="number"
          class="form-input ${this.heightError
            ? 'border-red-500 bg-red-50 dark:bg-red-950'
            : ''}"
          placeholder="${this.unit === 'metric'
            ? 'Enter height in cm'
            : 'Enter height in feet'}"
          step="${this.unit === 'metric' ? '1' : '0.1'}"
          min="0"
          .value="${this.heightInputValue}"
          @input="${this.handleHeightChange}"
        />
        ${this.renderErrorMessage(this.heightError)}
      </label>
    `;
  }

  private renderWeightInput() {
    return html`
      <label class="flex flex-col gap-1 w-full">
        <span class="block mb-1 text-sm font-medium"
          >Weight (${this.unit === 'metric' ? 'kg' : 'lbs'})</span
        >
        <input
          type="number"
          class="form-input ${this.weightError
            ? 'border-red-500 bg-red-50 dark:bg-red-950'
            : ''}"
          placeholder="${this.unit === 'metric'
            ? 'Enter weight in kg'
            : 'Enter weight in lbs'}"
          step="${this.unit === 'metric' ? '0.1' : '1'}"
          min="0"
          .value="${this.weightInputValue}"
          @input="${this.handleWeightChange}"
        />
        ${this.renderErrorMessage(this.weightError)}
      </label>
    `;
  }

  private renderResults() {
    return html`
      <div
        class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950"
      >
        <div class="text-2xl font-bold mb-2">
          BMI:
          <span class="${getCategoryClass(this.category)}">${this.bmi}</span>
        </div>
        <div class="text-lg font-semibold">
          Category:
          <span class="${getCategoryClass(this.category)}"
            >${this.category}</span
          >
        </div>
      </div>
    `;
  }

  private renderBMIRanges() {
    return html`
      <div
        class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 bg-gray-50 dark:bg-gray-800"
      >
        <h3 class="font-bold text-lg mb-3">BMI Categories:</h3>
        <ul class="list-disc pl-5 space-y-1 font-medium">
          <li class="text-blue-500">Underweight: Below 18.5</li>
          <li class="text-green-600">Normal weight: 18.5-24.9</li>
          <li class="text-orange-500">Overweight: 25-29.9</li>
          <li class="text-red-600">Obese: 30 or above</li>
        </ul>
      </div>
    `;
  }

  private renderNotes() {
    return html`
      <div>
        <h3 class="font-semibold text-sm mb-1">Note:</h3>
        <ul class="text-xs list-disc pl-5 space-y-1 leading-relaxed text-gray-500">
          <li>BMI is a screening tool and not diagnostic</li>
          <li>Results may vary based on age, gender, and muscle mass</li>
          <li>Consult healthcare professionals for medical advice</li>
        </ul>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderUnitSelector()}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${this.renderHeightInput()} ${this.renderWeightInput()}
        </div>
        ${this.bmi > 0 && !this.hasErrors
          ? html` ${this.renderResults()} ${this.renderBMIRanges()} `
          : ''}
        ${this.renderNotes()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bmi-calculator': BmiCalculator;
  }
}
