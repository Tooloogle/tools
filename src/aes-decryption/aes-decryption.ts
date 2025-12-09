import { html } from 'lit';
import {
  IConfigBase,
  WebComponentBase,
} from '../_web-component/WebComponentBase.js';
import aesDecryptionStyles from './aes-decryption.css.js';
import { customElement, property } from 'lit/decorators.js';
import CryptoJS from 'crypto-js';
import '../t-copy-button/t-copy-button.js';

@customElement('aes-decryption')
export class AesDecryption extends WebComponentBase<IConfigBase> {
  static override styles = [
    WebComponentBase.styles,
    aesDecryptionStyles];

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
      this.error = 'Please enter the secret key used for encryption';
      this.outputText = '';
      return;
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(this.inputText, this.secretKey);
      const plainText = decrypted.toString(CryptoJS.enc.Utf8);

      if (!plainText) {
        this.error =
          'Decryption failed - incorrect key or invalid encrypted data';
        this.outputText = '';
      } else {
        this.outputText = plainText;
      }
    } catch (err) {
      this.error = 'Error decrypting data - check your key and encrypted text';
      this.outputText = '';
    }
  }

  override render() {
    return html`
      <div class="space-y-4">
        <div>
          <label class="block mb-2 font-semibold">Secret Key:</label>
          <t-input type="password" placeholder="Enter secret key used for encryption..." class="w-full"></t-input>
        </div>
        <div>
          <label class="block mb-2 font-semibold">Encrypted Text:</label>
          <t-textarea placeholder="Enter encrypted text to decrypt..." class="w-full h-32 font-mono"></t-textarea>
        </div>
        ${this.error
          ? html`<div class="text-red-600 text-sm">${this.error}</div>`
          : ''}
        <div>
          <label class="block mb-2 font-semibold">Decrypted Text:</label>
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
    'aes-decryption': AesDecryption;
  }
}
