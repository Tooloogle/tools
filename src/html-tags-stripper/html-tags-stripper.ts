import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import htmlTagsStripperStyles from './html-tags-stripper.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button';
import '../t-textarea';

@customElement('html-tags-stripper')
export class HtmlTagsStripper extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    htmlTagsStripperStyles];

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

    // Strip HTML tags
    this.outputText = this.inputText.replace(/<[^>]*>/g, '');
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">HTML Input:</label>
          <t-textarea placeholder="Enter HTML to strip tags..." class="w-full h-32"></t-textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Plain Text Output:</label>
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
    'html-tags-stripper': HtmlTagsStripper;
  }
}
