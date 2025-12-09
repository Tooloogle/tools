import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  IConfigBase,
  WebComponentBase,
} from "../_web-component/WebComponentBase.js";
import {
  validateInput,
  calculateBMIValue,
  getBMICategory,
  getCategoryClass,
} from "./bmi-calculator-utils.js";
import bmiCalculatorStyles from "./bmi-calculator.css.js";
import "../t-input";
import "../t-select";

@customElement("bmi-calculator")
export class BmiCalculator extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, bmiCalculatorStyles];

  @property({ type: Number }) height = 0;
  @property({ type: Number }) weight = 0;
  @property({ type: Number }) bmi = 0;
  @property({ type: String }) category = "";
  @property({ type: String }) unit = "metric";
  @property({ type: String }) heightError = "";
  @property({ type: String }) weightError = "";
  @property({ type: Boolean }) hasErrors = false;
  @property({ type: String }) heightInputValue = "";
  @property({ type: String }) weightInputValue = "";

  private updateErrorState() {
    this.hasErrors = !!(this.heightError || this.weightError);
  }

  private clearResults() {
    this.bmi = 0;
    this.category = "";
  }

  private calculateBMI() {
    try {
      if (this.height > 0 && this.weight > 0 && !this.hasErrors) {
        this.bmi = calculateBMIValue(this.height, this.weight, this.unit);
        this.category = getBMICategory(this.bmi);
      } else {
        this.clearResults();
      }
    } catch (error) {
      console.error("BMI calculation error:", error);
      this.clearResults();
    }
  }

  private handleHeightInput(e: CustomEvent) {
    const value = parseFloat(e.detail.value);
    this.heightInputValue = e.detail.value;
    this.heightError = "";

    if (e.detail.value.trim() === "") {
      this.height = 0;
      this.clearResults();
    } else if (isNaN(value)) {
      this.heightError = "Please enter a valid number";
      this.height = 0;
      this.clearResults();
    } else {
      const validation = validateInput(value, "height", this.unit);
      if (validation.isValid) {
        this.height = value;
      } else {
        this.heightError = validation.error || "";
        this.height = 0;
        this.clearResults();
      }
    }

    this.updateErrorState();
    if (!this.hasErrors) {
      this.calculateBMI();
    }
  }

  private handleWeightInput(e: CustomEvent) {
    const value = parseFloat(e.detail.value);
    this.weightInputValue = e.detail.value;
    this.weightError = "";

    if (e.detail.value.trim() === "") {
      this.weight = 0;
      this.clearResults();
    } else if (isNaN(value)) {
      this.weightError = "Please enter a valid number";
      this.weight = 0;
      this.clearResults();
    } else {
      const validation = validateInput(value, "weight", this.unit);
      if (validation.isValid) {
        this.weight = value;
      } else {
        this.weightError = validation.error || "";
        this.weight = 0;
        this.clearResults();
      }
    }

    this.updateErrorState();
    if (!this.hasErrors) {
      this.calculateBMI();
    }
  }

  private handleUnitChange(e: CustomEvent) {
    this.unit = e.detail.value;
    this.heightError = "";
    this.weightError = "";

    if (this.heightInputValue && this.height > 0) {
      const heightValidation = validateInput(this.height, "height", this.unit);
      if (!heightValidation.isValid) {
        this.heightError = heightValidation.error || "";
        this.height = 0;
      }
    }

    if (this.weightInputValue && this.weight > 0) {
      const weightValidation = validateInput(this.weight, "weight", this.unit);
      if (!weightValidation.isValid) {
        this.weightError = weightValidation.error || "";
        this.weight = 0;
      }
    }

    this.updateErrorState();
    this.calculateBMI();
  }

  private renderUnitSelector() {
    return html`
      <div>
        <label class="block text-sm font-medium mb-2"> Unit System: </label>
        <t-select
          .value="${this.unit}"
          @t-change="${this.handleUnitChange}"
          .options="${[
            { value: "metric", label: "Metric (cm/kg)" },
            { value: "imperial", label: "Imperial (ft/lbs)" },
          ]}"
        ></t-select>
      </div>
    `;
  }

  private renderHeightInput() {
    const unitLabel = this.unit === "metric" ? "cm" : "ft";
    const placeholder =
      this.unit === "metric" ? "Enter height in cm" : "Enter height in feet";

    return html`
      <div>
        <label class="block text-sm font-medium mb-2">
          Height (${unitLabel}):
        </label>
        <t-input
          type="number"
          class="${this.heightError ? "error" : ""}"
          placeholder="${placeholder}"
          .value="${this.heightInputValue}"
          @t-input="${this.handleHeightInput}"
        ></t-input>
        ${this.heightError
          ? html`<div class="text-sm text-rose-500 mt-1">
              ${this.heightError}
            </div>`
          : ""}
      </div>
    `;
  }

  private renderWeightInput() {
    const unitLabel = this.unit === "metric" ? "kg" : "lbs";
    const placeholder =
      this.unit === "metric" ? "Enter weight in kg" : "Enter weight in lbs";

    return html`
      <div>
        <label class="block text-sm font-medium mb-2">
          Weight (${unitLabel}):
        </label>
        <t-input
          type="number"
          class="${this.weightError ? "error" : ""}"
          placeholder="${placeholder}"
          .value="${this.weightInputValue}"
          @t-input="${this.handleWeightInput}"
        ></t-input>
        ${this.weightError
          ? html`<div class="text-sm text-rose-500 mt-1">
              ${this.weightError}
            </div>`
          : ""}
      </div>
    `;
  }

  private renderResults() {
    if (this.bmi <= 0 || this.hasErrors) {
      return "";
    }

    return html`
      <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">BMI:</span>
          <span class="text-xl font-bold ${getCategoryClass(this.category)}">
            ${this.bmi.toFixed(1)}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="font-medium">Category:</span>
          <span
            class="text-lg font-semibold ${getCategoryClass(this.category)}"
          >
            ${this.category}
          </span>
        </div>
      </div>
    `;
  }

  private renderBMICategories() {
    return html`
      <div
        class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
      >
        <h3 class="text-sm font-semibold mb-3">BMI Categories:</h3>
        <ul class="space-y-1 text-sm">
          <li class="text-blue-500">• Underweight: Below 18.5</li>
          <li class="text-green-600">• Normal weight: 18.5-24.9</li>
          <li class="text-orange-500">• Overweight: 25-29.9</li>
          <li class="text-red-600">• Obese: 30 or above</li>
        </ul>
      </div>
    `;
  }

  private renderNotes() {
    return html`
      <div>
        <h3 class="text-sm font-semibold mb-2">Note:</h3>
        <ul class="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <li>• BMI is a screening tool and not diagnostic</li>
          <li>• Results may vary based on age, gender, and muscle mass</li>
          <li>• Consult healthcare professionals for medical advice</li>
        </ul>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="space-y-4">
        ${this.renderUnitSelector()} ${this.renderHeightInput()}
        ${this.renderWeightInput()} ${this.renderResults()}
        ${this.renderBMICategories()} ${this.renderNotes()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bmi-calculator": BmiCalculator;
  }
}
