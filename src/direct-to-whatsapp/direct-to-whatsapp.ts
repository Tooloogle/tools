import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from "../_styles/input.css.js"
import buttonStyles from "../_styles/button.css.js"
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import directToWhatsappStyles from './direct-to-whatsapp.css.js';

@customElement('direct-to-whatsapp')
export class DirectToWhatsApp extends WebComponentBase<IConfigBase> {
  static override styles = [WebComponentBase.styles, inputStyles, buttonStyles, directToWhatsappStyles];

  @property()
  phone = "";

  validateForm(e: FormDataEvent) {
    if (!this.phone
      || !/^[0-9\-+]{9,15}$/.test(this.phone)) {
      e.preventDefault();
      return false;
    }

    return false;
  }

  override render() {
    return html`
      <form action="https://api.whatsapp.com/send" method="GET" @submit=${this.validateForm}>
        <div class="grid grid-cols-1 gap-4">
          <lable class="block">
            <span>Phone number with country code, e.g. +919876543210</span>
            <input
              name="phone"
              class="form-input"
              autofocus
              placeholder="Phone number with country code, e.g. +919876543210"
              .value=${this.phone}
              @change=${(e: any) => this.phone = e.target?.value?.replace(/ |-/g, "")} />
          </lable>
          <lable class="block">
            <span>Message (optional)</span>
            <textarea 
              name="text"
              class="form-textarea"
              placeholder="Message (optional)"></textarea>
          </lable>
          <div class="text-end">
            <button type="submit" class="btn btn-blue">Open in Whatsapp</button>
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
