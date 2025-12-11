import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import textTruncatorStyles from './text-truncator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('text-truncator')
export class TextTruncator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    textTruncatorStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.convert();
  }

  private convert() {
    const maxLen = 50;
    this.outputText =
      this.inputText.length > maxLen
        ? `${this.inputText.substring(0, maxLen)}...`
        : this.inputText;
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <t-textarea placeholder="Enter text to truncate..." class="w-full h-32" .value="${this.inputText}" @t-input=${this.handleInput}></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Truncated Output:</label>
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
    'text-truncator': TextTruncator;
  }
}
