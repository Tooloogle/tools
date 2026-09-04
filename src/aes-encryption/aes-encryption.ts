import { html } from 'lit';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import aesEncryptionStyles from './aes-encryption.css.js';
import { customElement, property } from 'lit/decorators.js';
import CryptoJS from 'crypto-js';
import '../t-copy-button/index.js';

@customElement('aes-encryption')
export class AesEncryption extends WebComponentBase {
  static override styles = [
    WebComponentBase.styles,
    aesEncryptionStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) secretKey = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) error = '';

  private handleInputChange(e: Event) {
    this.inputText = (e.target as HTMLTextAreaElement).value;
    this.process();
  }

  private handleKeyChange(e: Event) {
    this.secretKey = (e.target as HTMLInputElement).value;
    this.process();
  }

  private process() {
    this.error = '';

    if (!this.inputText) {
      this.outputText = '';
      return;
    }

    if (!this.secretKey) {
      this.error = 'Please enter a secret key';
      this.outputText = '';
      return;
    }

    try {
      const encrypted = CryptoJS.AES.encrypt(this.inputText, this.secretKey);
      this.outputText = encrypted.toString();
    } catch (err) {
      this.error = 'Error encrypting data';
      this.outputText = '';
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Secret Key:</label>
          <input
            type="password"
            class="form-input w-full"
            placeholder="Enter secret key for encryption..."
            .value=${this.secretKey}
            @input=${this.handleKeyChange}
          />
          <p class="text-sm text-gray-600 mt-1">
            Note: Keep this key safe - you'll need it to decrypt the data
          </p>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Plain Text:</label>
          <textarea
            class="form-textarea w-full h-32"
            placeholder="Enter text to encrypt..."
            .value=${this.inputText}
            @input=${this.handleInputChange}
          ></textarea>
        </div>
        <div class="text-red-600 dark:text-red-400 text-sm min-h-[1.25rem]">
          ${this.error}
        </div>
        <div>
          <label class="block mb-2 font-semibold">Encrypted Text:</label>
          <textarea
            class="form-textarea w-full h-32 font-mono"
            readonly
            .value=${this.outputText}
          ></textarea>
          <div class="py-2 text-right">
            <t-copy-button
              .text=${this.outputText}
              .isIcon=${false}
              .disabled=${!this.outputText}
            ></t-copy-button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'aes-encryption': AesEncryption;
  }
}
