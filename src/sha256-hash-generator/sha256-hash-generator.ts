import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import sha256HashGeneratorStyles from './sha256-hash-generator.css.js';
import { customElement, property } from 'lit/decorators.js';
import { isBrowser } from '../_utils/DomUtils.js';
import '../t-copy-button/t-copy-button.js';

@customElement('sha256-hash-generator')
export class Sha256HashGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    sha256HashGeneratorStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) error = '';

  private handleInput(e: CustomEvent) {
    this.inputText = e.detail.value;
    void this.process();
  }

  private async process() {
    this.error = '';

    if (!this.inputText) {
      this.outputText = '';
      return;
    }

    if (!isBrowser() || !window.crypto || !window.crypto.subtle) {
      this.error =
        'SHA-256 hashing requires a modern browser with Web Crypto API support';
      this.outputText = '';
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(this.inputText);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      this.outputText = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (err) {
      this.error = 'Error generating SHA-256 hash';
      this.outputText = '';
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Input Text:</label>
          <t-textarea placeholder="Enter text to hash..." class="w-full h-32"></t-textarea>
        </div>
        ${this.error
          ? html`<div class="text-red-600 text-sm">${this.error}</div>`
          : ''}
        <div>
          <label class="block mb-2 font-semibold">SHA-256 Hash:</label>
          <t-textarea ?readonly=${true} class="w-full h-32 font-mono"></t-textarea>
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
    'sha256-hash-generator': Sha256HashGenerator;
  }
}
