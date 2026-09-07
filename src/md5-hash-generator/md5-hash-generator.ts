import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import md5HashGeneratorStyles from './md5-hash-generator.css.js';
import { customElement, property, state } from 'lit/decorators.js';
import '../t-copy-button/index.js';
import md5 from 'blueimp-md5';

@customElement('md5-hash-generator')
export class Md5HashGenerator extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    md5HashGeneratorStyles];

  @property() input = '';
  @state() hash = '';
  @state() error = '';

  // Maximum allowed input size (100KB)
  private readonly MAX_INPUT_SIZE = 100 * 1024;

  private onInputChange(e: Event) {
    this.input = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private process() {
    this.error = '';

    if (!this.input) {
      this.hash = '';
      return;
    }

    if (new Blob([this.input]).size > this.MAX_INPUT_SIZE) {
      this.error = `Input is too large (max ${
        this.MAX_INPUT_SIZE / 1024
      }KB allowed)`;
      this.hash = '';
      return;
    }

    this.hash = md5(this.input);
  }

  clearAll() {
    this.input = '';
    this.hash = '';
    this.error = '';
  }

  override render() {
    return html` <div class="text-gray-900 dark:text-gray-100">
      <label class="block">
        <span class="inline-block py-1">Input Text</span>
        <textarea
          class="form-textarea"
          autofocus
          placeholder="Enter text to generate MD5 hash"
          rows="3"
          .value=${this.input}
          @input=${this.onInputChange}
        ></textarea>
      </label>

      ${this.error
        ? html`<div class="text-red-500 dark:text-red-400 mb-2">${this.error}</div>`
        : ''}

      <div class="flex gap-2">
        <button
          class="btn btn-red mt-1"
          @click=${this.clearAll}
          ?disabled=${!this.input && !this.hash}
        >
          Clear
        </button>
      </div>

      ${this.hash
        ? html`
            <div class="mt-4">
              <div class="card flex items-center justify-between gap-3">
                <strong class="break-all font-mono">${this.hash}</strong>
                <t-copy-button
                  class="shrink-0"
                  .isIcon=${true}
                  .text=${this.hash}
                ></t-copy-button>
              </div>
            </div>
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
