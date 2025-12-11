import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import passphraseGeneratorStyles from './passphrase-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('passphrase-generator')
export class PassphraseGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    passphraseGeneratorStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private process() {
    const wordCount = parseInt(this.inputText) || 4;
    const words = [
      'correct',
      'horse',
      'battery',
      'staple',
      'monkey',
      'dragon',
      'wizard',
      'castle',
      'ocean',
      'mountain',
      'forest',
      'river',
      'thunder',
      'lightning',
      'phoenix',
      'tiger'];

    const result = [];
    for (let i = 0; i < wordCount; i++) {
      const idx = Math.floor(Math.random() * words.length);
      result.push(words[idx]);
    }

    this.outputText = result.join('-');
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Number of Words:</label>
          <t-textarea placeholder="Enter number of words (default: 4)..." class="w-full h-32" .value="${this.inputText}" @t-input=${this.handleInput}></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Generated Passphrase:</label>
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
    'passphrase-generator': PassphraseGenerator;
  }
}
