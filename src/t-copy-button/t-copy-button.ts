import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { WebComponentBase } from "../_web-component/WebComponentBase.js";
import { hasClipboard } from "../_utils/DomUtils.js";
import tCopyButtonStyles from "./t-copy-button.css.js";
import tooltipStyles from "../_styles/tooltip.css.js";
import { when } from "lit/directives/when.js";
@customElement("t-copy-button")
export class TCopyButton extends WebComponentBase {
  static override styles = [WebComponentBase.styles, tCopyButtonStyles, tooltipStyles];

  @property({ type: Boolean })
  isIcon = true;

  @property({ type: String })
  text = "";

  @property({ type: Boolean })
  copying = false;

  @property({ type: String })
  override title = "Copy to clipboard";

  private copyTimeoutId?: number;

  async onClick() {
    if (!this.text || !hasClipboard()) {
      return;
    }

    try {
      this.copying = true;
      await navigator.clipboard.writeText(this.text);
      this.title = "Copied to clipboard!";

      if (this.copyTimeoutId) {
        clearTimeout(this.copyTimeoutId);
      }

      this.copyTimeoutId = window.setTimeout(() => {
        this.copying = false;
        this.title = "Copy to clipboard";
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      this.title = "Failed to copy";
      this.copying = false;
    }
  }

  private renderIconContent = () => {
    return html` <span class="text-lg"> ${this.copying ? "✅" : "❏"} </span> `;
  };

  private renderButtonContent = () => {
    return html`<button class="btn btn-green btn-sm">Copy</button>`;
  };

  private resetTitle = () => {
    this.title = "Copy to clipboard";
  };

  override render() {
    return html`
      <button
        type="button"
        class="copy-btn inline-block ${this.isIcon
          ? "px-1"
          : ""} cursor-pointer text-slate-400 tooltip-wrapper"
        @click=${this.onClick}
        @mouseleave=${this.resetTitle}
        aria-label=${this.title}
      >
        ${when(this.isIcon, this.renderIconContent)}
        ${when(!this.isIcon, this.renderButtonContent)}
        <span class="tooltip" role="status">${this.title}</span>
      </button>
    `;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "t-copy-button": TCopyButton;
  }
}
