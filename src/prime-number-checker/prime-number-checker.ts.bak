import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import primeNumberCheckerStyles from './prime-number-checker.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('prime-number-checker')
export class PrimeNumberChecker extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    primeNumberCheckerStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
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
          <t-textarea placeholder="Enter a number to check if it's prime..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Result:</label>
          <t-textarea ?readonly=${true} class="w-full h-32"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
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
