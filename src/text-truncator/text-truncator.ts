import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import textTruncatorStyles from './text-truncator.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('text-truncator')
export class TextTruncator extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    textTruncatorStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: Number }) maxLength = 50;

  private handleInput(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.convert();
  }

  private handleMaxLengthChange(e: Event) {
    const raw = Number((e.target as HTMLInputElement).value);
    this.maxLength = Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 50;
    this.convert();
  }

  private convert() {
    const maxLen = this.maxLength;
    this.outputText =
      this.inputText.length > maxLen
        ? `${this.inputText.substring(0, maxLen)}...`
        : this.inputText;
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <label class="block">
          <span class="inline-block py-1">Input Text</span>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to truncate..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </label>
        <label class="block">
          <span class="inline-block py-1">Max Length</span>
          <input
            class="form-input w-full text-end"
            type="number"
            min="1"
            .value=${this.maxLength}
            @input=${this.handleMaxLengthChange}
          />
        </label>
        <div>
          <div class="flex items-center justify-between">
            <span class="inline-block py-1">Truncated Output</span>
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
    'text-truncator': TextTruncator;
  }
}
