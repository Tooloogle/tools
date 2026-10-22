import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import textToLeetspeakStyles from './text-to-leetspeak.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('text-to-leetspeak')
export class TextToLeetspeak extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    textToLeetspeakStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.convert();
  }

  private convert() {
    const leet: { [key: string]: string } = {
      a: '4',
      e: '3',
      i: '1',
      o: '0',
      t: '7',
      s: '5',
      g: '9',
      b: '8',
    };
    this.outputText = this.inputText
      .toLowerCase()
      .split('')
      .map(c => leet[c] || c)
      .join('');
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <label class="block">
          <span class="inline-block py-1">Input Text</span>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to convert to leetspeak..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </label>
        <div>
          <div class="flex items-center justify-between">
            <span class="inline-block py-1">L33t Sp34k Output</span>
            <t-copy-button
              .disabled=${!this.outputText}
              .text=${this.outputText}
            ></t-copy-button>
          </div>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-to-leetspeak': TextToLeetspeak;
  }
}
