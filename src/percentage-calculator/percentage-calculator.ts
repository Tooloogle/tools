import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import percentageCalculatorStyles from './percentage-calculator.css.js';
import { customElement, property } from 'lit/decorators.js';

type CalculationMode = 'percentage-of' | 'is-what-percent' | 'percentage-change' | 'find-original';

@customElement('percentage-calculator')
export class PercentageCalculator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, percentageCalculatorStyles];

    @property({ type: String }) mode: CalculationMode = 'percentage-of';
    @property({ type: String }) value1 = '';
    @property({ type: String }) value2 = '';
    @property({ type: String }) result = '';
    @property({ type: String }) errorMessage = '';

    private handleModeChange(e: Event) {
        const select = e.target as HTMLSelectElement;
        this.mode = select.value as CalculationMode;
        this.clearResults();
    }

    private handleValue1Change(e: Event) {
        const input = e.target as HTMLInputElement;
        this.value1 = input.value;
        this.calculate();
    }

    private handleValue2Change(e: Event) {
        const input = e.target as HTMLInputElement;
        this.value2 = input.value;
        this.calculate();
    }

    private clearResults() {
        this.result = '';
        this.errorMessage = '';
    }

    private calculate() {
        this.errorMessage = '';
        
        const num1 = parseFloat(this.value1);
        const num2 = parseFloat(this.value2);

        // Clear result if inputs are empty
        if (this.value1.trim() === '' || this.value2.trim() === '') {
            this.result = '';
            return;
        }

        // Validate inputs
        if (isNaN(num1) || isNaN(num2)) {
            this.errorMessage = 'Please enter valid numbers';
            this.result = '';
            return;
        }

        try {
            this.performCalculation(num1, num2);
        } catch (error) {
            this.errorMessage = 'Calculation error occurred';
            this.result = '';
        }
    }

    private performCalculation(num1: number, num2: number) {
        switch (this.mode) {
            case 'percentage-of':
                // What is X% of Y?
                this.result = this.calculatePercentageOf(num1, num2);
                break;
            case 'is-what-percent':
                // X is what percent of Y?
                if (num2 === 0) {
                    this.errorMessage = 'Cannot divide by zero';
                    this.result = '';
                    return;
                }

                this.result = this.calculateWhatPercent(num1, num2);
                break;
            case 'percentage-change':
                // Percentage change from X to Y
                if (num1 === 0) {
                    this.errorMessage = 'Original value cannot be zero';
                    this.result = '';
                    return;
                }

                this.result = this.calculatePercentageChange(num1, num2);
                break;
            case 'find-original':
                // Find original value: Y is X% of what?
                if (num1 === 0) {
                    this.errorMessage = 'Percentage cannot be zero';
                    this.result = '';
                    return;
                }

                this.result = this.calculateOriginalValue(num1, num2);
                break;
        }
    }

    private calculatePercentageOf(percentage: number, value: number): string {
        const result = (percentage / 100) * value;
        return result.toFixed(2);
    }

    private calculateWhatPercent(value: number, total: number): string {
        const result = (value / total) * 100;
        return result.toFixed(2);
    }

    private calculatePercentageChange(original: number, newValue: number): string {
        const change = ((newValue - original) / original) * 100;
        return change.toFixed(2);
    }

    private calculateOriginalValue(percentage: number, value: number): string {
        const result = (value / percentage) * 100;
        return result.toFixed(2);
    }

    private getModeLabel(): { label1: string; label2: string; resultText: string } {
        switch (this.mode) {
            case 'percentage-of':
                return {
                    label1: 'Percentage (%)',
                    label2: 'Of Value',
                    resultText: 'Result'
                };
            case 'is-what-percent':
                return {
                    label1: 'Value',
                    label2: 'Of Total',
                    resultText: 'Percentage (%)'
                };
            case 'percentage-change':
                return {
                    label1: 'Original Value',
                    label2: 'New Value',
                    resultText: 'Percentage Change (%)'
                };
            case 'find-original':
                return {
                    label1: 'Percentage (%)',
                    label2: 'Is Value',
                    resultText: 'Original Value'
                };
            default:
                return {
                    label1: 'Value 1',
                    label2: 'Value 2',
                    resultText: 'Result'
                };
        }
    }

    private getModeDescription(): string {
        switch (this.mode) {
            case 'percentage-of':
                return 'Calculate what is X% of Y';
            case 'is-what-percent':
                return 'Calculate X is what percent of Y';
            case 'percentage-change':
                return 'Calculate percentage increase or decrease from X to Y';
            case 'find-original':
                return 'Find the original value when Y is X% of it';
            default:
                return '';
        }
    }

    private renderModeSelector() {
        return html`
            <div class="mode-selector">
                <label>Calculation Type:</label>
                <select class="form-input" @change="${this.handleModeChange}">
                    <option value="percentage-of" ?selected="${this.mode === 'percentage-of'}">
                        What is X% of Y?
                    </option>
                    <option value="is-what-percent" ?selected="${this.mode === 'is-what-percent'}">
                        X is what percent of Y?
                    </option>
                    <option value="percentage-change" ?selected="${this.mode === 'percentage-change'}">
                        Percentage change from X to Y
                    </option>
                    <option value="find-original" ?selected="${this.mode === 'find-original'}">
                        Y is X% of what?
                    </option>
                </select>
                <p class="mode-description">${this.getModeDescription()}</p>
            </div>
        `;
    }

    private renderInputs() {
        const labels = this.getModeLabel();
        
        return html`
            <div class="inputs-container">
                <div class="input-group">
                    <label>${labels.label1}:</label>
                    <input
                        type="number"
                        class="form-input"
                        placeholder="Enter ${labels.label1.toLowerCase()}"
                        .value="${this.value1}"
                        @input="${this.handleValue1Change}"
                    />
                </div>

                <div class="input-group">
                    <label>${labels.label2}:</label>
                    <input
                        type="number"
                        class="form-input"
                        placeholder="Enter ${labels.label2.toLowerCase()}"
                        .value="${this.value2}"
                        @input="${this.handleValue2Change}"
                    />
                </div>
            </div>
        `;
    }

    private renderResult() {
        if (this.errorMessage) {
            return html`
                <div class="error-message">
                    ${this.errorMessage}
                </div>
            `;
        }

        if (this.result) {
            const labels = this.getModeLabel();
            const resultValue = parseFloat(this.result);
            const isNegative = resultValue < 0;
            const resultClass = this.mode === 'percentage-change' 
                ? (isNegative ? 'negative' : 'positive')
                : '';

            return html`
                <div class="result-container">
                    <div class="result-label">${labels.resultText}:</div>
                    <div class="result-value ${resultClass}">
                        ${this.mode === 'percentage-change' && !isNegative ? '+' : ''}${this.result}${this.mode === 'is-what-percent' || this.mode === 'percentage-change' ? '%' : ''}
                    </div>
                </div>
            `;
        }

        return '';
    }

    private renderExamples() {
        return html`
            <div class="examples">
                <h3>Examples:</h3>
                <ul>
                    <li><strong>What is X% of Y?</strong> - Calculate 20% of 500 = 100</li>
                    <li><strong>X is what percent of Y?</strong> - 25 is what percent of 200? = 12.5%</li>
                    <li><strong>Percentage change</strong> - From 100 to 120 = +20%</li>
                    <li><strong>Find original</strong> - 50 is 25% of what? = 200</li>
                </ul>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="container">
                ${this.renderModeSelector()}
                ${this.renderInputs()}
                ${this.renderResult()}
                ${this.renderExamples()}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'percentage-calculator': PercentageCalculator;
    }
}
