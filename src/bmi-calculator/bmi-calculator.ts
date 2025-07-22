import { html, customElement, property } from 'lit-element'
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import bmiCalculatorStyles from './bmi-calculator.css.js';

@customElement('bmi-calculator')
export class BmiCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, bmiCalculatorStyles];
    
    @property({ type: Number }) height = 0;
    @property({ type: Number }) weight = 0;
    @property({ type: Number }) bmi = 0;
    @property({ type: String }) category = '';
    @property({ type: String }) unit = 'metric';

    private handleHeightChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.height = parseFloat(input.value) || 0;
        this.calculateBMI();
    }

    private handleWeightChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.weight = parseFloat(input.value) || 0;
        this.calculateBMI();
    }

    private handleUnitChange(e: Event) {
        const select = e.target as HTMLSelectElement;
        this.unit = select.value;
        this.calculateBMI();
    }

    private calculateBMI() {
        if (this.height > 0 && this.weight > 0) {
            let heightInMeters = this.height;
            let weightInKg = this.weight;

            if (this.unit === 'imperial') {
                heightInMeters = this.height * 0.3048;
                weightInKg = this.weight * 0.453592;
            } else {
                heightInMeters = this.height / 100;
            }

            this.bmi = Math.round((weightInKg / (heightInMeters * heightInMeters)) * 10) / 10;
            this.category = this.getBMICategory(this.bmi);
        } else {
            this.bmi = 0;
            this.category = '';
        }
    }

    private getBMICategory(bmi: number): string {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    private getCategoryColor(category: string): string {
        switch (category) {
            case 'Underweight': return '#3498db';
            case 'Normal weight': return '#27ae60';
            case 'Overweight': return '#f39c12';
            case 'Obese': return '#e74c3c';
            default: return '#95a5a6';
        }
    }

    private renderUnitSelector() {
        return html`
            <div class="unit-selector">
                <label>Unit System:</label>
                <select class="form-input" @change="${this.handleUnitChange}">
                    <option value="metric" ?selected="${this.unit === 'metric'}">Metric (cm/kg)</option>
                    <option value="imperial" ?selected="${this.unit === 'imperial'}">Imperial (ft/lbs)</option>
                </select>
            </div>
        `;
    }

    private renderHeightInput() {
        return html`
            <div class="input-group">
                <label>Height (${this.unit === 'metric' ? 'cm' : 'ft'}):</label>
                <input 
                    type="number" 
                    class="form-input" 
                    placeholder="${this.unit === 'metric' ? 'Enter height in cm' : 'Enter height in feet'}"
                    @input="${this.handleHeightChange}" 
                />
            </div>
        `;
    }

    private renderWeightInput() {
        return html`
            <div class="input-group">
                <label>Weight (${this.unit === 'metric' ? 'kg' : 'lbs'}):</label>
                <input 
                    type="number" 
                    class="form-input" 
                    placeholder="${this.unit === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}"
                    @input="${this.handleWeightChange}" 
                />
            </div>
        `;
    }

    private renderResults() {
        return html`
            <div class="result-container">
                <div class="bmi-value">BMI: <span style="color: ${this.getCategoryColor(this.category)}"> ${this.bmi}</span></div>
                <div class="category-display">
                    Category: <span style="color: ${this.getCategoryColor(this.category)}">${this.category}</span>
                </div>
            </div>
        `;
    }

    private renderBMIRanges() {
        return html`
            <div class="bmi-ranges">
                <h3>BMI Categories:</h3>
                <ul>
                    <li style="color: #3498db">Underweight: Below 18.5</li>
                    <li style="color: #27ae60">Normal weight: 18.5-24.9</li>
                    <li style="color: #f39c12">Overweight: 25-29.9</li>
                    <li style="color: #e74c3c">Obese: 30 or above</li>
                </ul>
            </div>
        `;
    }

    private renderNotes() {
        return html`
            <div>
                <h3>Note:</h3>
                <ul class="note">
                    <li>BMI is a screening tool and not diagnostic</li>
                    <li>Results may vary based on age, gender, and muscle mass</li>
                    <li>Consult healthcare professionals for medical advice</li>
                </ul>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="container">
                ${this.renderUnitSelector()}
                ${this.renderHeightInput()}
                ${this.renderWeightInput()}
                ${this.bmi > 0 ? html`
                    ${this.renderResults()}
                    ${this.renderBMIRanges()}
                ` : ''}
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