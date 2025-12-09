import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import vowelConsonantCounterStyles from './vowel-consonant-counter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';

@customElement('vowel-consonant-counter')
export class VowelConsonantCounter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    vowelConsonantCounterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.convert();
  }

  private convert() {
    const vowels = this.inputText.match(/[aeiou]/gi) || [];
    const consonants = this.inputText.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
    this.outputText = `Vowels: ${vowels.length}\nConsonants: ${consonants.length}`;
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <t-textarea placeholder="Enter text..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold"
            >Vowel and Consonant Count:</label
          >
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
    'vowel-consonant-counter': VowelConsonantCounter;
  }
}
