import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import letterCounterStyles from './letter-counter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('letter-counter')
export class LetterCounter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    letterCounterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
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
          <t-textarea placeholder="Enter text to count letters..." class="w-full h-32" .value=${this.inputText} @t-input=${this.handleInput}></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Letter Count:</label>
          <t-textarea ?readonly=${true} class="w-full h-32" .value=${this.outputText}></t-textarea>
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
