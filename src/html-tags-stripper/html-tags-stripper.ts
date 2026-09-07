import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import htmlTagsStripperStyles from './html-tags-stripper.css.js';
import { customElement, property } from 'lit/decorators.js';
import '../t-copy-button/index.js';

@customElement('html-tags-stripper')
export class HtmlTagsStripper extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    htmlTagsStripperStyles];

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

    // DOMParser does not execute scripts, so untrusted HTML is safe here.
    const doc = new DOMParser().parseFromString(this.inputText, 'text/html');
    doc.querySelectorAll('script, style').forEach((el) => el.remove());
    this.outputText = (doc.body.textContent ?? '').trim();
  }

  override render() {
    return html`
      <div class="space-y-4 text-gray-900 dark:text-gray-100">
        <div>
          <label class="block mb-2 font-semibold">HTML Input:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter HTML to strip tags..."
            .value=${this.inputText}
            @input=${this.handleInput}
          ></textarea>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Plain Text Output:</label>
          <textarea
            class="form-textarea w-full h-32"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="py-2 text-right">
            <t-copy-button .isIcon=${false} .disabled=${!this.outputText} .text=${this.outputText}></t-copy-button>
          </div>
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
