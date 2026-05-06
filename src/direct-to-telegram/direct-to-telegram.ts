import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WebComponentBase } from '../_web-component/WebComponentBase.js';
import directToTelegramStyles from './direct-to-telegram.css.js';

@customElement('direct-to-telegram')
export class DirectToTelegram extends WebComponentBase {
  static override styles = [WebComponentBase.styles, directToTelegramStyles];

  @property()
  target = "";

  private buildUrl(): string | null {
    const value = this.target.trim();
    if (!value) {
      return null;
    }

    // Phone with country code (digits, optional leading +)
    if (/^\+?[0-9]{9,15}$/.test(value)) {
      const digits = value.replace(/\D/g, "");
      return `https://t.me/+${digits}`;
    }

    // Telegram username (5–32 chars, starts with letter, allows leading @)
    if (/^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(value)) {
      return `https://t.me/${value.replace(/^@/, "")}`;
    }

    return null;
  }

  validateForm(e: FormDataEvent) {
    const url = this.buildUrl();
    if (!url) {
      e.preventDefault();
      return false;
    }

    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const textarea = form?.elements.namedItem("text") as HTMLTextAreaElement | null;
    const message = textarea?.value?.trim() || "";
    const finalUrl = message ? `${url}?text=${encodeURIComponent(message)}` : url;

    window.location.href = finalUrl;
    return false;
  }

  private onTargetChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.target = target?.value?.replace(/ |-/g, "") || "";
  }

  override render() {
    return html`
      <form action="https://t.me/" method="GET" @submit=${this.validateForm}>
        <div class="grid grid-cols-1 gap-4">
          <label class="block">
            <span>Telegram username (e.g. @durov) or phone with country code, e.g. +919876543210</span>
            <input
              name="target"
              class="form-input"
              autofocus
              placeholder="@username or +919876543210"
              .value=${this.target}
              @input=${this.onTargetChange} />
          </label>
          <label class="block">
            <span>Message (optional)</span>
            <textarea
              name="text"
              class="form-textarea"
              placeholder="Message (optional)"></textarea>
          </label>
          <div class="text-end">
            <button type="submit" class="btn btn-blue">Open in Telegram</button>
          </div>
      </div>
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'direct-to-telegram': DirectToTelegram;
  }
}
