import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import textHighlighterStyles from './text-highlighter.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';

@customElement('text-highlighter')
export class TextHighlighter extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    textHighlighterStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private process() {
    if (!this.inputText) {
      this.outputText = '';
      return;
    }

    const lines = this.inputText.split('\n');
    if (lines.length < 2) {
      this.outputText = this.inputText;
      return;
    }

    const searchTerm = lines[0];
    const text = lines.slice(1).join('\n');

    if (!searchTerm) {
      this.outputText = text;
      return;
    }

    const highlighted = text.replace(
      new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
      match => `**${match}**`
    );

    this.outputText = highlighted;
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input:</label>
          <t-textarea placeholder="Enter input..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Output:</label>
          <t-textarea ?readonly=${true} class="w-full h-32"></t-textarea>
          ${this.outputText
            ? html`<t-copy-button .text=${this.outputText}></t-copy-button>`
            : ''}
        </div>
        <div class="text-sm text-gray-600">
          Note: Highlight search terms in text
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-highlighter': TextHighlighter;
  }
}
