import { html, customElement, property } from 'lit-element'
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import inputStyles from '../_styles/input.css.js';
import buttonStyles from '../_styles/button.css.js';
import bmiCalculatorStyles from './bmi-calculator.css.js';

@customElement('bmi-calculator')
export class BmiCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, bmiCalculatorStyles];
    
    @property({ type: Number }) height = 0;
    @property({ type: Number }) weight = 0;
    @property({ type: Number }) bmi = 0;
    @property({ type: String }) category = '';
    @property({ type: String }) unit = 'metric'; // 'metric' or 'imperial'

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
                // Convert feet/inches to meters and pounds to kg
                heightInMeters = this.height * 0.3048; // feet to meters
                weightInKg = this.weight * 0.453592; // pounds to kg
            } else {
                heightInMeters = this.height / 100; // cm to meters
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

    override render() {
        return html`
            <div class="container">
                <div class="unit-selector">
                    <label>Unit System:</label>
                    <select class="form-input" @change="${this.handleUnitChange}">
                        <option value="metric" ?selected="${this.unit === 'metric'}">Metric (cm/kg)</option>
                        <option value="imperial" ?selected="${this.unit === 'imperial'}">Imperial (ft/lbs)</option>
                    </select>
                </div>

                <div class="input-group">
                    <label>Height (${this.unit === 'metric' ? 'cm' : 'ft'}):</label>
                    <input 
                        type="number" 
                        class="form-input" 
                        placeholder="${this.unit === 'metric' ? 'Enter height in cm' : 'Enter height in feet'}"
                        @input="${this.handleHeightChange}" 
                    />
                </div>

                <div class="input-group">
                    <label>Weight (${this.unit === 'metric' ? 'kg' : 'lbs'}):</label>
                    <input 
                        type="number" 
                        class="form-input" 
                        placeholder="${this.unit === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}"
                        @input="${this.handleWeightChange}" 
                    />
                </div>

                ${this.bmi > 0 ? html`
                    <div class="result-container">
                        <div class="bmi-display">
                            <div class="bmi-value">BMI: <span style="color: ${this.getCategoryColor(this.category)}"> ${this.bmi}</span></div>
                        </div>
                        <div class="category-display">
                           Category: <span style="color: ${this.getCategoryColor(this.category)}">${this.category}</span>
                        </div>
                    </div>
                    
                    <div class="bmi-ranges">
                        <h3>BMI Categories:</h3>
                        <ul>
                            <li style="color: #3498db">Underweight: Below 18.5</li>
                            <li style="color: #27ae60">Normal weight: 18.5-24.9</li>
                            <li style="color: #f39c12">Overweight: 25-29.9</li>
                            <li style="color: #e74c3c">Obese: 30 or above</li>
                        </ul>
                    </div>
                ` : ''}
                <div>
                <h3>Note:</h3>
                <ul class="info">
                    <li>BMI is a screening tool and not diagnostic</li>
                    <li>Results may vary based on age, gender, and muscle mass</li>
                    <li>Consult healthcare professionals for medical advice</li>
                </ul>
            </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'bmi-calculator': BmiCalculator;
    }
}