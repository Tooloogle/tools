import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import letterCounterStyles from './letter-counter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('letter-counter')
export class LetterCounter extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,    letterCounterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.convert();
  }

  private convert() {
    const letters = this.inputText.replace(/[^a-zA-Z]/g, '');
    this.outputText = `Total letters: ${letters.length}`;
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to count letters..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Letter Count:</label>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
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
    'letter-counter': LetterCounter;
  }
}
