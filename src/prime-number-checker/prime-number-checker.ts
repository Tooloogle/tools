import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import primeNumberCheckerStyles from './prime-number-checker.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('prime-number-checker')
export class PrimeNumberChecker extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, primeNumberCheckerStyles];

    @property({ type: String }) inputText = '';
    @property({ type: String }) outputText = '';

    private handleInput(e: Event) {
        this.inputText = (e.target as HTMLTextAreaElement).value;
        this.process();
    }

    private process() {
        if (!this.inputText || isNaN(Number(this.inputText))) {
            this.outputText = '';
            return;
        }

        const num = parseInt(this.inputText);
        if (num < 2) {
            this.outputText = `${num} is not a prime number`;
            return;
        }

        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                this.outputText = `${num} is not a prime number (divisible by ${i})`;
                return;
            }
        }

        this.outputText = `${num} is a prime number!`;
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Number Input:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter a number to check if it's prime..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Result:</label>
                    <textarea
                        class="form-input w-full h-32"
                        readonly
                        .value=${this.outputText}
                    ></textarea>
                    ${this.outputText ? html`<t-copy-button .text=${this.outputText}></t-copy-button>` : ''}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'prime-number-checker': PrimeNumberChecker;
    }
}
