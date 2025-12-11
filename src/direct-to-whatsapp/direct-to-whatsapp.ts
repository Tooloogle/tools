import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import directToWhatsappStyles from './direct-to-whatsapp.css.js';
import '../t-button';
import '../t-input';
import '../t-textarea';

@customElement('direct-to-whatsapp')
export class DirectToWhatsApp extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, directToWhatsappStyles];

  @property()
  phone = "";

  @property()
  message = "";

  validateForm(e: FormDataEvent) {
    if (!this.phone
      || !/^[0-9\-+]{9,15}$/.test(this.phone)) {
      e.preventDefault();
      return false;
    }

    return false;
  }

  private onPhoneChange(e: CustomEvent) {
    this.phone = e.detail.value?.replace(/ |-/g, "") || "";
  }

  private onMessageChange(e: CustomEvent) {
    this.message = e.detail.value || "";
  }

  override render() {
    return html`
      <form action="https://api.whatsapp.com/send" method="GET" @submit=${this.validateForm}>
        <div class="grid grid-cols-1 gap-4">
          <label class="block">
            <span>Phone number with country code, e.g. +919876543210</span>
            <t-input placeholder="Phone number with country code, e.g. +919876543210" .value="${this.phone}" @t-input=${this.onPhoneChange} name="phone"></t-input>
          </label>
          <label class="block">
            <span>Message (optional)</span>
            <t-textarea placeholder="Message (optional)" .value="${this.message}" @t-input=${this.onMessageChange} name="text"></t-textarea>
          </label>
          <div class="text-end">
            <t-button variant="blue">Open in Whatsapp</t-button>
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
