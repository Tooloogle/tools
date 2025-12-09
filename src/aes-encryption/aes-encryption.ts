import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import aesEncryptionStyles from './aes-encryption.css.js';
import { customElement, property } from 'lit/decorators.js';
import CryptoJS from 'crypto-js';
import '../t-copy-button';
import '../t-input';
import '../t-textarea';

@customElement('aes-encryption')
export class AesEncryption extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    aesEncryptionStyles];

  @property({ type: String }) inputText = '';
  @property({ type: String }) secretKey = '';
  @property({ type: String }) outputText = '';
  @property({ type: String }) error = '';

  private handleInputChange(e: CustomEvent) {
    this.inputText = e.detail.value;
    this.process();
  }

  private handleKeyChange(e: CustomEvent) {
    this.secretKey = e.detail.value;
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
          <t-input type="password" placeholder="Enter secret key for encryption..." class="w-full" .value=${this.secretKey} @t-input=${this.handleKeyChange}></t-input>
          <p class="text-sm text-gray-600 mt-1">
            Note: Keep this key safe - you'll need it to decrypt the data
          </p>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Plain Text:</label>
          <t-textarea placeholder="Enter text to encrypt..." class="w-full h-32" .value=${this.inputText} @t-input=${this.handleInputChange}></t-textarea>
        </div>
        ${this.error
          ? html`<div class="text-red-600 text-sm">${this.error}</div>`
          : ''}
        <div>
          <label class="block mb-2 font-semibold">Encrypted Text:</label>
          <t-textarea ?readonly=${true} class="w-full h-32 font-mono" .value=${this.outputText}></t-textarea>
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
