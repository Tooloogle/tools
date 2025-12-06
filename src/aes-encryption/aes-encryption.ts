import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import aesEncryptionStyles from './aes-encryption.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';
import CryptoJS from 'crypto-js';
import '../t-copy-button';

@customElement('aes-encryption')
export class AesEncryption extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    inputStyles,
    aesEncryptionStyles,
  ];

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
        ${this.error
          ? html`<div class="text-red-600 text-sm">${this.error}</div>`
          : ''}
        <div>
          <label class="block mb-2 font-semibold">Encrypted Text:</label>
          <textarea
            class="form-textarea w-full h-32 font-mono"
            readonly
            .value=${this.outputText}
          ></textarea>
          ${this.outputText
            ? html`<t-copy-button
                .text=${this.outputText}
                .isIcon=${false}
              ></t-copy-button>`
            : ''}
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
