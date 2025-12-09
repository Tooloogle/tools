import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import randomNumberGeneratorStyles from './random-number-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-button';
import '../t-input';

@customElement('random-number-generator')
export class RandomNumberGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, randomNumberGeneratorStyles];

    @property()
    min = 1;

    @property()
    max = 100;

    @property()
    count = 1;

    @property()
    allowDuplicates = true;

    @property()
    results: number[] = [];

    private handleMinChange(e: CustomEvent) {
        this.min = Number(e.detail.value);
    }

    private handleMaxChange(e: CustomEvent) {
        this.max = Number(e.detail.value);
    }

    private handleCountChange(e: CustomEvent) {
        this.count = Number(e.detail.value);
    }

    private handleDuplicatesChange(e: Event) {
        this.allowDuplicates = (e.target as HTMLInputElement).checked;
    }

    private generate() {
        const numbers: number[] = [];
        const range = this.max - this.min + 1;

        if (!this.allowDuplicates && this.count > range) {
            alert(`Cannot generate ${this.count} unique numbers in range ${this.min}-${this.max}`);
            return;
        }

        if (this.allowDuplicates) {
            for (let i = 0; i < this.count; i++) {
                numbers.push(Math.floor(Math.random() * range) + this.min);
            }
        } else {
            const available = Array.from({ length: range }, (_, i) => this.min + i);
            for (let i = 0; i < this.count; i++) {
                const index = Math.floor(Math.random() * available.length);
                numbers.push(available[index]);
                available.splice(index, 1);
            }
        }

        this.results = numbers;
    }

    private renderResults() {
        return this.results.map(num => html`
            <div class="px-4 py-2 bg-blue-500 text-white rounded font-bold">
                ${num}
            </div>
        `);
    }

    private renderInputs() {
        return html`
            <div class="grid grid-cols-2 gap-4">
                <label class="block">
                    <span class="inline-block py-1">Minimum</span>
                    <t-input type="number" class="text-end"></t-input>
                </label>

                <label class="block">
                    <span class="inline-block py-1">Maximum</span>
                    <t-input type="number" class="text-end"></t-input>
                </label>
            </div>

            <label class="block">
                <span class="inline-block py-1">How many numbers?</span>
                <t-input type="number" class="text-end"></t-input>
            </label>

            <label class="flex items-center">
                <input
                    type="checkbox"
                    class="form-checkbox"
                    .checked=${this.allowDuplicates}
                    @change=${this.handleDuplicatesChange}
                />
                <span class="ml-2">Allow duplicates</span>
            </label>
        `;
    }

    private renderResultsDisplay() {
        return html`
            <div class="mt-4 p-4 bg-gray-50 rounded">
                <h3 class="font-bold mb-2">Results:</h3>
                <div class="flex flex-wrap gap-2">
                    ${this.renderResults()}
                </div>
            </div>
        `;
    }

    override render() {
        return html`
            <div class="space-y-4">
                ${this.renderInputs()}

                <div class="text-right">
                    <t-button variant="blue" @click=${this.generate}>Generate</t-button>
                </div>

                ${this.results.length > 0 ? this.renderResultsDisplay() : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'random-number-generator': RandomNumberGenerator;
    }
}
