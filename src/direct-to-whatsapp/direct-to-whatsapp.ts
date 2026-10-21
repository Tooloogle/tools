import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import directToWhatsappStyles from './direct-to-whatsapp.css.js';
import { buildWhatsAppUrl, normalizeInternationalPhone } from '../_utils/messaging-links.js';
import '../t-copy-button/index.js';

@customElement('direct-to-whatsapp')
export class DirectToWhatsApp extends WebComponentBase {
  static override styles = [WebComponentBase.styles, directToWhatsappStyles];

  @property()
  phone = "";

  @property() message = '';
  @property() output = '';
  @property() error = '';
  @property() private recipient = '';

  private updateLink() {
    this.output = '';
    this.error = '';
    this.recipient = '';
    if (!this.phone.trim()) {
      return;
    }

    try {
      this.recipient = normalizeInternationalPhone(this.phone);
      this.output = buildWhatsAppUrl(this.phone, this.message);
    } catch (error) {
      this.error = (error as Error).message;
    }
  }

  validateForm(e: Event) {
    this.updateLink();
    if (!this.output) {
      e.preventDefault();
      this.error ||= 'Enter an international phone number with its country code.';
      return false;
    }

    return true;
  }

  private onPhoneChange(e: Event) {
    this.phone = (e.target as HTMLInputElement).value;
    this.updateLink();
  }

  private onMessageChange(e: Event) {
    this.message = (e.target as HTMLTextAreaElement).value;
    this.updateLink();
  }

  private reset() {
    this.phone = '';
    this.message = '';
    this.updateLink();
  }

  override render() {
    return html`
      <form class="text-gray-900 dark:text-gray-100" action="https://api.whatsapp.com/send" method="GET" @submit=${this.validateForm}>
        <input type="hidden" name="phone" .value=${this.recipient} />
        <div class="grid grid-cols-1 gap-4">
          <label class="block">
            <span>Phone number with country code, e.g. +919876543210</span>
            <input
              type="tel"
              data-input="phone"
              class="form-input"
              autofocus
              placeholder="Phone number with country code, e.g. +919876543210"
              .value=${this.phone}
              @input=${this.onPhoneChange} />
          </label>
          <label class="block">
            <span>Message (optional)</span>
            <textarea 
              name="text"
              class="form-textarea"
              rows="4"
              .value=${this.message}
              @input=${this.onMessageChange}
              placeholder="Message (optional)"></textarea>
          </label>
          ${this.error ? html`<p role="alert" class="text-red-700 dark:text-red-300">${this.error}</p>` : ''}
          <label class="block">WhatsApp link
            <input type="text" data-output class="form-input font-mono text-sm" readonly .value=${this.output} />
          </label>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <button type="submit" class="btn btn-blue">Open in Whatsapp</button>
            <button type="button" class="btn btn-red" @click=${this.reset}>Reset</button>
            <t-copy-button .isIcon=${false} .text=${this.output} .disabled=${!this.output}></t-copy-button>
          </div>
      </div>
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'direct-to-whatsapp': DirectToWhatsApp;
  }
}
