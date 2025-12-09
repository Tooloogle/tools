import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import md5HashGeneratorStyles from './md5-hash-generator.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import '../t-copy-button';
import md5 from 'blueimp-md5';
import '../t-button';
import '../t-input';
import '../t-textarea';

@customElement('md5-hash-generator')
export class Md5HashGenerator extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    md5HashGeneratorStyles];

  @property() input = '';
  @property() hash = '';
  @state() error = '';
  @state() isGenerating = false;

  // Maximum allowed input size (100KB)
  private readonly MAX_INPUT_SIZE = 100 * 1024;

  private onInputChange(e: CustomEvent) {
    this.error = '';
    this.input = e.detail.value;
  }

  private validateInput(): boolean {
    if (!this.input.trim()) {
      this.error = 'Please enter some text to generate hash';
      return false;
    }

    if (this.input.length > this.MAX_INPUT_SIZE) {
      this.error = `Input is too large (max ${
        this.MAX_INPUT_SIZE / 1024
      }KB allowed)`;
      return false;
    }

    return true;
  }

  async generateHash() {
    try {
      if (!this.validateInput()) {
        return;
      }

      this.isGenerating = true;
      this.error = '';

      await new Promise(requestAnimationFrame);
      this.hash = md5(this.input);
    } catch (err) {
      console.error('MD5 generation failed:', err);
      this.error = 'Failed to generate MD5 hash. Please try again.';
      this.hash = '';
    } finally {
      this.isGenerating = false;
    }
  }

  clearAll() {
    this.input = '';
    this.hash = '';
    this.error = '';
  }

  // eslint-disable-next-line max-lines-per-function
  override render() {
    return html` <div>
      <label class="block">
        <span class="inline-block py-1">Input Text</span>
        <t-textarea placeholder="Enter text to generate MD5 hash" rows="3" .value=${String(this.input)} @t-input=${this.onInputChange}></t-textarea>
      </label>

      ${this.error
        ? html`<div class="text-red-500 mb-2">${this.error}</div>`
        : ''}

      <div class="button-group">
        <t-button variant="blue" @click=${this.generateHash} ?disabled=${true}>
          ${this.isGenerating ? 'Generating...' : 'Generate MD5 Hash'}
        </t-button>
        <t-button variant="red" @click=${this.clearAll} ?disabled=${true}>
          Clear All
        </t-button>
      </div>

      ${this.hash
        ? html`
            <label class="block">
              <div class="flex items-center justify-between gap-1 mt-4">
                <span class="inline-block py-1">MD5 Hash</span>
                <t-copy-button .text=${this.hash}></t-copy-button>
              </div>
              <t-input .value=${String(this.hash)} ?readonly=${true}></t-input>
            </label>

            <p>
              <strong>Note:</strong> MD5 is a one-way cryptographic hash
              function. Always produces a 32-character hexadecimal hash (0-9,
              a-f). The same input will always produce the same hash, but the
              original text cannot be recovered from the hash.
            </p>
          `
        : ''}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md5-hash-generator': Md5HashGenerator;
  }
}
