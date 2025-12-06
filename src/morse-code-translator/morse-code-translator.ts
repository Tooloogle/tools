import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import morseCodeTranslatorStyles from './morse-code-translator.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import '../t-copy-button';

@customElement('morse-code-translator')
export class MorseCodeTranslator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    morseCodeTranslatorStyles,
  ];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    if (!this.inputText) {
      this.outputText = '';
      return;
    }

    const morseMap: { [key: string]: string } = {
      A: '.-',
      B: '-...',
      C: '-.-.',
      D: '-..',
      E: '.',
      F: '..-.',
      G: '--.',
      H: '....',
      I: '..',
      J: '.---',
      K: '-.-',
      L: '.-..',
      M: '--',
      N: '-.',
      O: '---',
      P: '.--.',
      Q: '--.-',
      R: '.-.',
      S: '...',
      T: '-',
      U: '..-',
      V: '...-',
      W: '.--',
      X: '-..-',
      Y: '-.--',
      Z: '--..',
      '0': '-----',
      '1': '.----',
      '2': '..---',
      '3': '...--',
      '4': '....-',
      '5': '.....',
      '6': '-....',
      '7': '--...',
      '8': '---..',
      '9': '----.',
      ' ': '/',
    };

    const reverseMorse: { [key: string]: string } = {};
    Object.keys(morseMap).forEach(k => (reverseMorse[morseMap[k]] = k));

    // Check if input is morse code
    if (this.inputText.match(/^[.\-\s/]+$/)) {
      // Decode morse
      this.outputText = this.inputText
        .split(' ')
        .map(code => reverseMorse[code] || code)
        .join('');
    } else {
      // Encode to morse
      this.outputText = this.inputText
        .toUpperCase()
        .split('')
        .map(c => morseMap[c] || c)
        .join(' ');
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input (Text or Morse):</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text or morse code..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Output:</label>
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
    'morse-code-translator': MorseCodeTranslator;
  }
}
