import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import vowelConsonantCounterStyles from './vowel-consonant-counter.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';

@customElement('vowel-consonant-counter')
export class VowelConsonantCounter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    vowelConsonantCounterStyles,
  ];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
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
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold"
            >Vowel and Consonant Count:</label
          >
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
    'vowel-consonant-counter': VowelConsonantCounter;
  }
}
