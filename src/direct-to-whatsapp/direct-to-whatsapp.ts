import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { gridStyles } from "../_styles/grid.css.js"
import { inputStyles } from "../_styles/input.css.js"
import { buttonStyles } from "../_styles/button.css.js"
import { marginUtilsStyles } from '../_styles/margin-utils.css.js';
import { utilsStyles } from '../_styles/utils.css.js';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';

@customElement('direct-to-whatsapp')
export class DirectToWhatsApp extends WebComponentBase<IConfigBase> {
  static override styles = [gridStyles, inputStyles, buttonStyles, marginUtilsStyles, utilsStyles];

  @property()
  phone = "";

  validateForm(e: FormDataEvent) {
    if (!this.phone
      || !/^[0-9\-\+]{9,15}$/.test(this.phone)) {
      e.preventDefault();
      return false;
    }

    return false;
  }

  override render() {
    return html`
      <form action="https://api.whatsapp.com/send" method="GET" @submit=${this.validateForm}>
        <div class="row">
            <div class="col">
                <input 
                  name="phone"
                  class="my-2"
                  autofocus
                  placeholder="Phone number with country code, e.g. +919876543210"
                  .value=${this.phone}
                  @change=${(e: any) => this.phone = e.target?.value?.replace(/ |-/g, "")} />
                <textarea name="text" class="my-2" placeholder="Message (optional)"></textarea>
            </div>
        </div>
        <div class="text-end">
          <button type="submit" class="btn">Open in Whatsapp</button>
        <div>
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'direct-to-whatsapp': DirectToWhatsApp;
  }
}
