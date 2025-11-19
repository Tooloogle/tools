import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import fibonacciGeneratorStyles from './fibonacci-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

@customElement('fibonacci-generator')
export class FibonacciGenerator extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, fibonacciGeneratorStyles];

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

        const n = parseInt(this.inputText);
        if (n < 1 || n > 100) {
            this.outputText = 'Please enter a number between 1 and 100';
            return;
        }

        const fib = [0, 1];
        for (let i = 2; i < n; i++) {
            fib[i] = fib[i - 1] + fib[i - 2];
        }

        this.outputText = fib.slice(0, n).join(', ');
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 font-semibold">Count:</label>
                    <textarea
                        class="form-input w-full h-32"
                        placeholder="Enter count of Fibonacci numbers (1-100)..."
                        .value=${this.inputText}
                        @input=${this.handleInput}
                    ></textarea>
                </div>
                <div>
                    <label class="block mb-2 font-semibold">Fibonacci Sequence:</label>
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
        'fibonacci-generator': FibonacciGenerator;
    }
}
