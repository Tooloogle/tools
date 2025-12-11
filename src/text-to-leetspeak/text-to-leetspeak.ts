import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import textToLeetspeakStyles from './text-to-leetspeak.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('text-to-leetspeak')
export class TextToLeetspeak extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    textToLeetspeakStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
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
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <t-textarea placeholder="Enter text to convert to leetspeak..." class="w-full h-32" .value="${this.inputText}" @t-input=${this.handleInput}></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">L33t Sp34k Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32" .value="${this.outputText}"></t-textarea>
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
    'text-to-leetspeak': TextToLeetspeak;
  }
}
